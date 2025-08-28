from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from your React app

# Database connection configuration
DB_CONFIG = {
    "dbname": "minip",
    "user": "postgres",
    "password": "r@ghu@123",
    "host": "localhost",
    "port": "5432",
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)

def get_data():
    """Retrieve past data from the database ordered by creation time."""
    conn = get_db_connection()
    query = "SELECT created_at, income, debt, credit_score, loan_amount FROM inddata ORDER BY created_at ASC"
    df = pd.read_sql(query, conn)
    conn.close()
    return df

def prepare_data(df):
    """Convert created_at to datetime and add a numeric timestamp column."""
    df['created_at'] = pd.to_datetime(df['created_at'])
    df['timestamp'] = df['created_at'].apply(lambda x: x.timestamp())
    return df

def predict_timeseries(df, days_ahead=30):
    """
    Predict a time series for each metric for the next `days_ahead` days.
    Returns:
      - future_dates: a list of date strings (YYYY-MM-DD) for each future day.
      - predictions: a dict where keys are metric names and values are lists of predicted values.
    """
    # Use the numeric timestamp as the independent variable
    X = df[['timestamp']].values

    future_dates = []
    future_timestamps = []
    for d in range(1, days_ahead+1):
        future_date = datetime.now() + timedelta(days=d)
        future_dates.append(future_date.strftime("%Y-%m-%d"))
        future_timestamps.append(future_date.timestamp())
    future_timestamps = np.array(future_timestamps).reshape(-1, 1)

    predictions = {}
    # Predict for all desired metrics
    for col in ['income', 'debt', 'credit_score', 'loan_amount']:
        y = df[col].values
        model = LinearRegression()
        model.fit(X, y)
        pred_values = model.predict(future_timestamps)
        predictions[col] = pred_values.tolist()
    
    return future_dates, predictions

@app.route("/fpredict", methods=["GET"])
def predict():
    df = get_data()
    if df.empty:
        return jsonify({"success": False, "message": "No data available for prediction."}), 404
    df = prepare_data(df)
    future_dates, predictions = predict_timeseries(df, days_ahead=30)
    
    return jsonify({
        "success": True,
        "future_dates": future_dates,
        "predictions": predictions
    })

if __name__ == "__main__":
    app.run(debug=True, port=5002)
