import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Suppress TensorFlow info/warning logs

import warnings
warnings.filterwarnings("ignore")  # Suppress warnings (e.g., SettingWithCopyWarning)

import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

def forecast_sales(file_path="Fathom_Example_Import_File.xlsx"):
    df = pd.read_excel(file_path, header=4)
    df_sales = df[(df['Classification'] == 'REV') & (df['Account Name'] == 'Sales')]
    df_sales.dropna(axis=1, how='all', inplace=True)

    date_cols = df_sales.columns[3:]
    sales_values = df_sales.iloc[0, 3:].values.astype(float)

    df_ts = pd.DataFrame({'Sales': sales_values}, index=date_cols)
    df_ts.index = pd.to_datetime(df_ts.index, errors='coerce')
    df_ts.dropna(axis=0, inplace=True)

    scaler = MinMaxScaler(feature_range=(0, 1))
    sales_scaled = scaler.fit_transform(df_ts[['Sales']].values)

    def create_sequences(data, seq_length=2):
        X, y = [], []
        for i in range(len(data) - seq_length):
            X.append(data[i:i+seq_length])
            y.append(data[i+seq_length])
        return np.array(X), np.array(y)

    seq_length = 2
    X, y = create_sequences(sales_scaled, seq_length)

    split_idx = int(len(X) * 0.8)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
    X_test  = X_test.reshape((X_test.shape[0],  X_test.shape[1],  1))

    model = Sequential([
        LSTM(32, activation='relu', return_sequences=True, input_shape=(seq_length, 1)),
        LSTM(32, activation='relu'),
        Dense(1)
    ])
    model.compile(optimizer='adam', loss='mse')
    model.fit(X_train, y_train, epochs=20, batch_size=1, verbose=0)

    y_pred = model.predict(X_test)
    y_pred_actual = scaler.inverse_transform(y_pred)
    y_test_actual = scaler.inverse_transform(y_test.reshape(-1,1))

    test_dates = df_ts.index[seq_length + split_idx : seq_length + split_idx + len(X_test)]
    chart_data = []
    for i in range(len(test_dates)):
        chart_data.append({
            "date": str(test_dates[i].date()),
            "actual": float(y_test_actual[i][0]),
            "predicted": float(y_pred_actual[i][0])
        })
    return chart_data

if __name__ == "__main__":
    points = forecast_sales("Fathom_Example_Import_File.xlsx")
    # Prefix output so Node.js can reliably extract JSON from stdout
    print("RESULT:" + json.dumps(points))
