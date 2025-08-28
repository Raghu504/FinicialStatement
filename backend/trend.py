import pandas as pd
import numpy as np
import json
import sys

def load_data(file_path, skiprows=4):
    """
    Loads the Excel file, skipping metadata rows.
    Assumes the first row after skiprows contains:
    [Classification, Account Name, Account Code, Month1, Month2, ...]
    For simplicity, we assume there are 6 months and rename them.
    """
    df_raw = pd.read_excel(file_path, sheet_name=0, skiprows=skiprows, header=None)
    header_row = df_raw.iloc[0]
    fixed_cols = ["Classification", "Account Name", "Account Code"]
    # Assume there are 6 month columns; rename them:
    month_cols = ["Jan-22", "Feb-22", "Mar-22", "Apr-22", "May-22", "Jun-22"]
    new_columns = fixed_cols + month_cols
    df = df_raw.iloc[1:].copy()  # drop header row from data
    df.columns = new_columns
    for col in month_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df, month_cols

def extract_revenue(df, month_cols):
    """
    Extracts revenue data from rows where Classification is "REV"
    and sums them (if more than one row).
    Returns a Series with month names as index.
    """
    rev_df = df[df["Classification"] == "REV"]
    if rev_df.empty:
        return pd.Series([0]*len(month_cols), index=month_cols)
    revenue = rev_df.iloc[:, 3:].sum()
    return revenue

if __name__ == "__main__":
    # The Excel file is named Fathom_Example_Import_File.xlsx (adjust path if needed)
    file_path = sys.argv[1]  # File path passed from the Node.js backend
    df, month_cols = load_data(file_path, skiprows=4)
    revenue = extract_revenue(df, month_cols)
    
    # Convert the revenue Series to a list of objects: [{Month: "Jan-22", Revenue: value}, ...]
    output = [{"Month": m, "Revenue": revenue[m]} for m in month_cols]
    print(json.dumps(output, indent=4))
