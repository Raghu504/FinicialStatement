import pandas as pd
import numpy as np
import json

def load_excel_header(file_path, skiprows=4):
    raw_df = pd.read_excel(file_path, skiprows=skiprows, header=None)
    header_row = raw_df.iloc[0]
    fixed_cols = ["Classification", "Account Name", "Account Code"]
    month_cols = header_row[3:].tolist()
    new_columns = fixed_cols + month_cols

    df = raw_df.iloc[1:].copy()
    df.columns = new_columns

    for col in month_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    return df, month_cols

def compute_kpis(file_path, skiprows=4):
    df, month_cols = load_excel_header(file_path, skiprows=skiprows)
    df_class_sum = df.groupby("Classification")[month_cols].sum(numeric_only=True)
    df_acc_sum = df.groupby("Account Name")[month_cols].sum(numeric_only=True)

    # Income Statement
    revenue = df_class_sum.loc["REV"] if "REV" in df_class_sum.index else pd.Series(0, index=month_cols)
    cost_of_sales = df_class_sum.loc["VCOS"] if "VCOS" in df_class_sum.index else pd.Series(0, index=month_cols)

    fexp = df_class_sum.loc["FEXP"] if "FEXP" in df_class_sum.index else pd.Series(0, index=month_cols)
    vexp = df_class_sum.loc["VEXP"] if "VEXP" in df_class_sum.index else pd.Series(0, index=month_cols)
    da   = df_class_sum.loc["DA"]   if "DA" in df_class_sum.index else pd.Series(0, index=month_cols)
    operating_expenses = fexp + vexp + da

    ainc = df_class_sum.loc["AINC"] if "AINC" in df_class_sum.index else pd.Series(0, index=month_cols)
    iinc = df_class_sum.loc["IINC"] if "IINC" in df_class_sum.index else pd.Series(0, index=month_cols)
    total_other_income = ainc + iinc

    other_expenses = pd.Series(0, index=month_cols)
    for code in ["OEXP", "IEXP", "TEXP", "ADJ"]:
        if code in df_class_sum.index:
            other_expenses += df_class_sum.loc[code]

    gross_profit = revenue - cost_of_sales
    gross_margin = (gross_profit / revenue) * 100
    operating_income = gross_profit - operating_expenses
    net_income = operating_income + total_other_income - other_expenses
    net_profit_margin = (net_income / revenue) * 100

    # Balance Sheet
    cash = df_acc_sum.loc["Cash & Equivalents"] if "Cash & Equivalents" in df_acc_sum.index else pd.Series(0, index=month_cols)
    ar   = df_acc_sum.loc["Accounts Receivable"] if "Accounts Receivable" in df_acc_sum.index else pd.Series(0, index=month_cols)
    inv  = df_acc_sum.loc["Inventory"] if "Inventory" in df_acc_sum.index else pd.Series(0, index=month_cols)
    oca  = df_acc_sum.loc["Other Current Assets"] if "Other Current Assets" in df_acc_sum.index else pd.Series(0, index=month_cols)
    current_assets = cash + ar + inv + oca

    std = df_acc_sum.loc["Short Term Debt"] if "Short Term Debt" in df_acc_sum.index else pd.Series(0, index=month_cols)
    ap  = df_acc_sum.loc["Accounts Payable"] if "Accounts Payable" in df_acc_sum.index else pd.Series(0, index=month_cols)
    tl  = df_acc_sum.loc["Tax Liability"] if "Tax Liability" in df_acc_sum.index else pd.Series(0, index=month_cols)
    ocl = df_acc_sum.loc["Accruals"] if "Accruals" in df_acc_sum.index else pd.Series(0, index=month_cols)
    current_liabilities = std + ap + tl + ocl

    working_capital = current_assets - current_liabilities
    current_ratio = current_assets / current_liabilities
    quick_ratio = (current_assets - inv) / current_liabilities

    ltd = df_acc_sum.loc["Long Term Debt"] if "Long Term Debt" in df_acc_sum.index else pd.Series(0, index=month_cols)
    reserves    = df_acc_sum.loc["Reserves"] if "Reserves" in df_acc_sum.index else pd.Series(0, index=month_cols)
    other_equity = df_acc_sum.loc["Other Equity"] if "Other Equity" in df_acc_sum.index else pd.Series(0, index=month_cols)
    share_cap    = df_acc_sum.loc["Share Capital"] if "Share Capital" in df_acc_sum.index else pd.Series(0, index=month_cols)
    retained_e   = df_acc_sum.loc["Opening Retained Earnings"] if "Opening Retained Earnings" in df_acc_sum.index else pd.Series(0, index=month_cols)
    total_equity = reserves + other_equity + share_cap + retained_e

    debt_to_equity = (std + ltd) / total_equity

    kpi_data = {
        "Revenue": revenue,
        "Cost of Sales": cost_of_sales,
        "Gross Profit": gross_profit,
        "Gross Margin (%)": gross_margin,
        "Operating Expenses": operating_expenses,
        "Operating Income": operating_income,
        "Other Income": total_other_income,
        "Other Expenses": other_expenses,
        "Net Income": net_income,
        "Net Profit Margin (%)": net_profit_margin,
        "Working Capital": working_capital,
        "Current Ratio": current_ratio,
        "Quick Ratio": quick_ratio,
        "Debt to Equity": debt_to_equity
    }

    df_kpis = pd.DataFrame(kpi_data, index=month_cols).T
    return df_kpis

def define_targets(actual_df):
    kpi_target_factor = {
        "Revenue": 1.05,
        "Cost of Sales": 1.00,
        "Gross Profit": 1.05,
        "Gross Margin (%)": 1.00,
        "Operating Expenses": 0.95,
        "Operating Income": 1.10,
        "Other Income": 1.00,
        "Other Expenses": 1.00,
        "Net Income": 1.10,
        "Net Profit Margin (%)": 1.00,
        "Working Capital": 1.05,
        "Current Ratio": 1.00,
        "Quick Ratio": 1.00,
        "Debt to Equity": 1.00
    }
    df_target = actual_df.copy()
    for kpi_name in df_target.index:
        factor = kpi_target_factor.get(kpi_name, 1.00)
        df_target.loc[kpi_name] = actual_df.loc[kpi_name] * factor
    return df_target

def combine_actual_target_variance(actual_df, target_df):
    common_cols = actual_df.columns.intersection(target_df.columns)
    actual_df = actual_df[common_cols]
    target_df = target_df[common_cols]
    variance_df = actual_df - target_df

    # Build MultiIndex for rows
    actual_df.index   = pd.MultiIndex.from_product([["Actual"], actual_df.index])
    target_df.index   = pd.MultiIndex.from_product([["Target"], target_df.index])
    variance_df.index = pd.MultiIndex.from_product([["Variance"], variance_df.index])

    df_combined = pd.concat([actual_df, target_df, variance_df])
    return df_combined

def df_to_kpi_json(df_combined):
    """
    Transform the multi-index DataFrame into a JSON structure
    that can be displayed like the screenshot.

    The screenshot shows:
      CATEGORY (Profitability, Liquidity, etc.)
         KPI NAME
            RESULT   TARGET   vs TARGET   TREND   IMPORTANCE
    We'll do a simplified example, focusing on one column (e.g., the last month).
    You can expand to multiple months if you like.
    """

    # Let's pick the last column as "current period" to mimic the screenshot
    # e.g., the last column might be "Jun-22"
    if len(df_combined.columns) == 0:
        return []

    last_month = df_combined.columns[-1]

    # We'll create an example "category" mapping for each KPI:
    # In a real scenario, you might define these categories or compute them.
    category_map = {
        "Revenue": "PROFITABILITY",
        "Cost of Sales": "PROFITABILITY",
        "Gross Profit": "PROFITABILITY",
        "Gross Margin (%)": "PROFITABILITY",
        "Operating Expenses": "PROFITABILITY",
        "Operating Income": "PROFITABILITY",
        "Net Income": "PROFITABILITY",
        "Net Profit Margin (%)": "PROFITABILITY",
        "Other Income": "ACTIVITY",
        "Other Expenses": "ACTIVITY",
        "Current Ratio": "LIQUIDITY",
        "Quick Ratio": "LIQUIDITY",
        "Working Capital": "LIQUIDITY",
        "Debt to Equity": "LIQUIDITY",
        # etc. Add more as needed
    }

    # We'll store data in this structure:
    # [
    #   {
    #     category: "PROFITABILITY",
    #     rows: [
    #       { kpiName, result, target, vsTarget, trend, importance },
    #       ...
    #     ]
    #   },
    #   ...
    # ]

    result_list = []

    # df_combined has 3 levels in the row index: ["Actual", "Target", "Variance"] x KPI
    # columns are months. We'll pick out the last month column.
    # Example approach: pivot from multi-index to a dict for each KPI.

    # Row index is something like: ("Actual", "Revenue"), ("Target", "Revenue"), ("Variance", "Revenue")...
    # We'll group by the second level of the index (the KPI name).
    for kpi_name in df_combined.index.levels[1]:
        # Extract actual, target, variance for that KPI (if they exist)
        actual_val = None
        target_val = None
        variance_val = None

        for level0 in ["Actual", "Target", "Variance"]:
            idx = (level0, kpi_name)
            if idx in df_combined.index:
                val = df_combined.loc[idx, last_month]
                if level0 == "Actual":
                    actual_val = val
                elif level0 == "Target":
                    target_val = val
                else:
                    variance_val = val

        # Compute vsTarget (✓ or ×) if you want
        vs_target = "×"
        if actual_val is not None and target_val is not None:
            if actual_val >= target_val:
                vs_target = "✓"

        # Compute a Trend (▲ or ▼) from variance or other logic
        # For simplicity, let's say if variance >= 0 => "▲", else "▼"
        trend_symbol = "▲" if (variance_val is not None and variance_val >= 0) else "▼"
        # Example numeric difference in parentheses
        trend_diff = f"{variance_val:.2f}" if variance_val is not None else "0"
        trend = f"{trend_symbol} {trend_diff}"

        # Importance can be determined by logic or default
        # We'll do a simple example: if it's "Revenue" or "Net Income", call it "Critical"
        importance_map = {
            "Revenue": "Critical",
            "Net Income": "Critical",
            "Cost of Sales": "High",
            "Operating Expenses": "High",
            "Gross Profit": "Medium",
            "Gross Margin (%)": "Medium",
        }
        importance = importance_map.get(kpi_name, "Medium")

        # Convert values to strings with formatting
        def fmt(val):
            if val is None or pd.isna(val):
                return "-"
            return f"{val:,.2f}"

        row_dict = {
            "kpiName": kpi_name,
            "result": fmt(actual_val),
            "target": fmt(target_val),
            "vsTarget": vs_target,
            "trend": trend,
            "importance": importance
        }

        # Get the category
        cat = category_map.get(kpi_name, "OTHER")

        # Insert into the result structure
        # Check if we already have that category
        cat_entry = next((c for c in result_list if c["category"] == cat), None)
        if not cat_entry:
            cat_entry = {"category": cat, "rows": []}
            result_list.append(cat_entry)
        cat_entry["rows"].append(row_dict)

    return result_list

if __name__ == "__main__":
    file_path = "Fathom_Example_Import_File.xlsx"
    df_kpis_actual = compute_kpis(file_path, skiprows=4)
    df_kpis_target = define_targets(df_kpis_actual)
    df_combined = combine_actual_target_variance(df_kpis_actual, df_kpis_target)

    # Convert df_combined to a JSON structure that matches your table layout
    output = df_to_kpi_json(df_combined)

    # Print as JSON to stdout for Node.js
    print(json.dumps(output, indent=2))
