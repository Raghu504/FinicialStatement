import pandas as pd
import numpy as np
import json
import sys

def load_data(file_path, skiprows=4):
    """
    Loads the Excel file and sets the header row from the file.
    Assumes the first row after skiprows contains:
    [Classification, Account Name, Account Code, Month1, Month2, ...]
    For simplicity, we assume 6 months.
    """
    df_raw = pd.read_excel(file_path, sheet_name=0, skiprows=skiprows, header=None)
    header_row = df_raw.iloc[0]
    fixed_cols = ["Classification", "Account Name", "Account Code"]
    # We'll assume there are 6 months and rename them
    month_cols = ["Jan-22", "Feb-22", "Mar-22", "Apr-22", "May-22", "Jun-22"]
    new_columns = fixed_cols + month_cols
    df = df_raw.iloc[1:].copy()  # drop header row from data
    df.columns = new_columns

    # Convert month columns to numeric
    for col in month_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    return df, month_cols

def extract_series(df, key, by="Classification"):
    rows = df[df[by] == key]
    if not rows.empty:
        return rows.iloc[:, 3:].sum()  # sum if multiple rows exist
    else:
        return pd.Series([0]*6, index=["Jan-22", "Feb-22", "Mar-22", "Apr-22", "May-22", "Jun-22"])

def extract_balance_item(df, account_name):
    rows = df[df["Account Name"] == account_name]
    if not rows.empty:
        return rows.iloc[0, 3:].astype(float)
    else:
        return pd.Series([0]*6, index=["Jan-22", "Feb-22", "Mar-22", "Apr-22", "May-22", "Jun-22"])

def compute_monthly_diff(series):
    diff = series.diff()
    diff.iloc[0] = 0
    return diff

def compute_cash_flow(file_path):
    df, months = load_data(file_path, skiprows=4)
    
    # --- Income Statement Items ---
    Revenue = extract_series(df, "REV", by="Classification")
    Cost_of_Sales = extract_series(df, "VCOS", by="Classification")
    Expenses = extract_series(df, "FEXP", by="Classification") + extract_series(df, "VEXP", by="Classification")
    Other_Income = extract_series(df, "AINC", by="Classification") + extract_series(df, "IINC", by="Classification")
    Cash_Tax_Paid = extract_series(df, "TEXP", by="Account Name")
    
    # --- Balance Sheet Items (for Working Capital changes) ---
    Change_in_Accounts_Payable = compute_monthly_diff(extract_balance_item(df, "Accounts Payable"))
    Change_in_Other_Current_Liabilities = compute_monthly_diff(extract_balance_item(df, "Accruals"))
    Change_in_Accounts_Receivable = compute_monthly_diff(extract_balance_item(df, "Accounts Receivable"))
    Change_in_Inventory = compute_monthly_diff(extract_balance_item(df, "Inventory"))
    Change_in_Work_In_Progress = pd.Series([0]*len(months), index=months)
    Change_in_Other_Current_Assets = compute_monthly_diff(extract_balance_item(df, "Other Current Assets"))
    
    # --- Capital Expenditures & Non-Current Assets ---
    Change_in_Fixed_Assets = compute_monthly_diff(extract_balance_item(df, "Fixed Assets"))
    Change_in_Intangible_Assets = pd.Series([0]*len(months), index=months)
    Inv1 = extract_balance_item(df, "Investment or Other Non-Current Assets")
    Inv2 = extract_balance_item(df, "Investments")
    Total_Investments = Inv1 + Inv2
    Change_in_Investments = compute_monthly_diff(Total_Investments)
    
    # --- Financing Items ---
    Net_Interest = extract_series(df, "IINC", by="Classification") - extract_series(df, "IEXP", by="Classification")
    Change_in_Other_Non_Current_Liabilities = pd.Series([0]*len(months), index=months)
    Dividends = extract_series(df, "DIV", by="Classification")
    RE = extract_balance_item(df, "Opening Retained Earnings")
    Reserves = extract_balance_item(df, "Reserves")
    Other_Equity = extract_balance_item(df, "Other Equity")
    Share_Capital = extract_balance_item(df, "Share Capital")
    Total_Equity = Reserves + Other_Equity + Share_Capital + RE
    Change_in_Retained_Earnings = compute_monthly_diff(Total_Equity)
    Adjustments = extract_series(df, "ADJ", by="Classification")
    
    # --- Compute Cash Flow Metrics ---
    # Working Capital Change = Δ(AP) + Δ(Other CL) - Δ(AR) - Δ(Inventory) - Δ(WIP) - Δ(Other CA)
    Working_Capital_Change = (Change_in_Accounts_Payable + Change_in_Other_Current_Liabilities -
                              Change_in_Accounts_Receivable - Change_in_Inventory -
                              Change_in_Work_In_Progress - Change_in_Other_Current_Assets)
    
    # Operating Cash Flow = (Revenue - Cost of Sales - Expenses + Other Income - Cash Tax Paid) + Working Capital Change
    Operating_Cash_Flow = (Revenue - Cost_of_Sales - Expenses + Other_Income - Cash_Tax_Paid) + Working_Capital_Change
    
    # Free Cash Flow = Operating Cash Flow - (Change in Fixed Assets + Change in Intangible Assets + Change in Investments)
    Free_Cash_Flow = Operating_Cash_Flow - (Change_in_Fixed_Assets + Change_in_Intangible_Assets + Change_in_Investments)
    
    # Net Cash Flow = Free Cash Flow - Net Interest - Change in Other Non-Current Liabilities - Dividends + Change in Retained Earnings + Adjustments
    Net_Cash_Flow = Free_Cash_Flow - Net_Interest - Change_in_Other_Non_Current_Liabilities - Dividends + Change_in_Retained_Earnings + Adjustments
    
    metrics = {
        "Revenue": Revenue,
        "Cost of Sales": Cost_of_Sales,
        "Expenses": Expenses,
        "Other Income": Other_Income,
        "Cash Tax Paid": Cash_Tax_Paid,
        "Change in Accounts Payable": Change_in_Accounts_Payable,
        "Change in Other Current Liabilities": Change_in_Other_Current_Liabilities,
        "Change in Accounts Receivable": Change_in_Accounts_Receivable,
        "Change in Inventory": Change_in_Inventory,
        "Change in Work In Progress": Change_in_Work_In_Progress,
        "Change in Other Current Assets": Change_in_Other_Current_Assets,
        "Change in Fixed Assets": Change_in_Fixed_Assets,
        "Change in Intangible Assets": Change_in_Intangible_Assets,
        "Change in Investments": Change_in_Investments,
        "Net Interest (after tax)": Net_Interest,
        "Change in Other Non-Current Liabilities": Change_in_Other_Non_Current_Liabilities,
        "Dividends": Dividends,
        "Change in Retained Earnings": Change_in_Retained_Earnings,
        "Adjustments": Adjustments,
        "Operating Cash Flow": Operating_Cash_Flow,
        "Free Cash Flow": Free_Cash_Flow,
        "Net Cash Flow": Net_Cash_Flow
    }
    
    cash_flow_df = pd.DataFrame(metrics, index=months)
    return cash_flow_df

if __name__ == "__main__":
    # Use the provided Excel file name (adjust extension if needed)
    file_path = "Fathom_Example_Import_File.xlsx"
    cash_flow_metrics = compute_cash_flow(file_path)
    
    # Convert DataFrame to JSON with month included
    result_json = cash_flow_metrics.reset_index().rename(columns={"index": "Month"}).to_dict(orient="records")
    print(json.dumps(result_json, indent=4))
