import pandas as pd
import numpy as np
import json
import sys

def load_data(file_path, skiprows=4):
    """
    Loads the Excel file and sets the header row.
    Assumes the first row after skiprows contains:
    [Classification, Account Name, Account Code, Month1, Month2, ...]
    For simplicity, we assume there are 6 months and rename them accordingly.
    """
    df_raw = pd.read_excel(file_path, sheet_name=0, skiprows=skiprows, header=None)
    header_row = df_raw.iloc[0]
    fixed_cols = ["Classification", "Account Name", "Account Code"]
    # Rename the remaining columns to fixed names:
    month_cols = ["Jan-22", "Feb-22", "Mar-22", "Apr-22", "May-22", "Jun-22"]
    new_columns = fixed_cols + month_cols
    df = df_raw.iloc[1:].copy()  # data after header row
    df.columns = new_columns
    for col in month_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df, month_cols

def extract_series(df, key, by="Classification"):
    """
    Extracts a numeric Series for a given key from the dataframe.
    Sums values if multiple rows match.
    """
    rows = df[df[by] == key]
    if not rows.empty:
        return rows.iloc[:, 3:].sum()
    else:
        return pd.Series([0]*6, index=["Jan-22", "Feb-22", "Mar-22", "Apr-22", "May-22", "Jun-22"])

def compute_profit(file_path):
    """
    Computes profit for each month using the formula:
       Profit = Revenue - Cost of Sales - Expenses
    Revenue is taken from rows with Classification "REV"
    Cost of Sales from "VCOS"
    Expenses as the sum of rows with Classification "FEXP" and "VEXP"
    """
    df, months = load_data(file_path, skiprows=4)
    Revenue = extract_series(df, "REV", by="Classification")
    Cost_of_Sales = extract_series(df, "VCOS", by="Classification")
    Expenses = extract_series(df, "FEXP", by="Classification") + extract_series(df, "VEXP", by="Classification")
    Profit = Revenue - Cost_of_Sales - Expenses
    return Profit, months

if __name__ == "__main__":
    file_path = sys.argv[1]  # Excel file path passed as command-line argument
    profit, months = compute_profit(file_path)
    # Create a list of dicts for each month
    output = [{"Month": m, "Profit": profit[m]} for m in months]
    print(json.dumps(output, indent=4))
