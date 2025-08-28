from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

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

@app.route("/pastdata", methods=["POST"])
def get_past_data():
    data = request.json
    email = data.get("email")
    print("Email received:", email)
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Use the correct column name "email"
        cursor.execute("SELECT * FROM inddata WHERE email = %s", (email,))
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        conn.close()

        if not rows:
            return jsonify({"success": False, "message": "No data found for this email"}), 404

        # Convert to DataFrame for easier processing
        df = pd.DataFrame(rows, columns=columns)

        # Process data for charts (update columns as per your table)
        processed_data = {
            "barChart": df[["created_at", "income", "expenses", "debt", "loan_amount"]].to_dict(orient="records"),
            "lineChart": df[["created_at", "loan_amount"]].to_dict(orient="records"),
        }

        return jsonify({"success": True, "data": processed_data})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
