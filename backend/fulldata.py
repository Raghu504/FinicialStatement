import sys
import json

def analyze_financial_data(data):
    results = {}
    # Only these three categories will be processed.
    categories = ["income", "debt", "expenses"]

    for category in categories:
        values = []
        for entry in data:
            try:
                # Convert each value to float; default to 0 if key is missing.
                value = float(entry.get(category, 0))
                values.append(value)
            except ValueError:
                # If conversion fails, use a default value of 0.
                values.append(0)
        
        if values:
            results[category] = {
                "data_points": values,
                "min": min(values),
                "max": max(values),
                "average": sum(values) / len(values)
            }
        else:
            results[category] = {
                "data_points": [],
                "min": None,
                "max": None,
                "average": None
            }
    return results

# Read JSON input from stdin (provided by the Node.js backend)
input_data = sys.stdin.read()
try:
    financial_data = json.loads(input_data)
except Exception as e:
    print(json.dumps({"error": f"Error parsing input JSON: {str(e)}"}))
    sys.exit(1)

output_data = analyze_financial_data(financial_data)

# Print the results as JSON (Node.js will capture this output)
print(json.dumps(output_data))
