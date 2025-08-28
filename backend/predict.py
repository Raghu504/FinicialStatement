from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json  # Get JSON data from request
        print("Received data:", data)  # Debugging print

        if not data:
            return jsonify({"error": "No data received"}), 400

        ratio = data.get("ratio")
        records = data.get("data")

        if not ratio or not records:
            return jsonify({"error": "Missing required fields"}), 400

        # Convert to DataFrame
        df = pd.DataFrame(records)
        print("DataFrame created:", df)  # Debugging print

        # Ensure necessary columns exist
        required_columns = {
            "Debt-Income Ratio": ["income", "debt"],
            "Savings Ratio": ["income", "expenses"],
            "Expense Ratio": ["income", "expenses"],
            "Investment Ratio": ["income", "investments"]
        }

        if ratio not in required_columns:
            return jsonify({"error": "Invalid ratio type"}), 400

        for col in required_columns[ratio]:
            if col not in df.columns:
                return jsonify({"error": f"Missing column: {col}"}), 400

        # Convert to numeric
        for col in required_columns[ratio]:
            df[col] = pd.to_numeric(df[col], errors="coerce")

        # Check for NaN values
        if df.isnull().values.any():
            return jsonify({"error": "Invalid numeric values in dataset"}), 400

        # Compute requested ratio
        if ratio == "Debt-Income Ratio":
            df["ratio_value"] = df["debt"] / df["income"]
        elif ratio == "Savings Ratio":
            df["ratio_value"] = (df["income"] - df["expenses"]) / df["income"]
        elif ratio == "Expense Ratio":
            df["ratio_value"] = df["expenses"] / df["income"]
        elif ratio == "Investment Ratio":
            df["ratio_value"] = df["investments"] / df["income"]

        # Compute insights
        result = {
            "min": df["ratio_value"].min(),
            "max": df["ratio_value"].max(),
            "average": df["ratio_value"].mean(),
            "data_points": df["ratio_value"].tolist()
        }

        print("Result:", result)  # Debugging print
        return jsonify(result)

    except Exception as e:
        print("Error:", str(e))  # Print error to console
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
