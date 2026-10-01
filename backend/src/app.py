from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

# ---------- In-memory storage ----------
users = [{"id": 1, "name": "Default"}]
incomes = []
categories = []
transactions = []
next_id = 1

def new_id():
    global next_id
    next_id += 1
    return next_id - 1

# ---------- Endpoints ----------
@app.route("/hello")
def hello():
    return jsonify(message="Hello from the API!")

@app.route("/income", methods=["GET", "POST"])
def income():
    if request.method == "POST":
        data = request.get_json()
        item = {"id": new_id(), "amount": data["amount"], "source": data.get("source")}
        incomes.append(item)
        return jsonify(item), 201
    return jsonify(incomes)

@app.route("/categories", methods=["GET", "POST"])
def category():
    if request.method == "POST":
        data = request.get_json()
        item = {"id": new_id(), "name": data["name"], "percent": data["percent"]}
        categories.append(item)
        return jsonify(item), 201
    return jsonify(categories)

@app.route("/transactions", methods=["GET", "POST"])
def transaction():
    if request.method == "POST":
        data = request.get_json()
        item = {
            "id": new_id(),
            "categoryId": data["categoryId"],
            "amount": data["amount"],
            "description": data.get("description"),
        }
        transactions.append(item)
        return jsonify(item), 201
    return jsonify(transactions)

# ---------- Summary ----------
@app.route("/summary")
def summary():
    total_income = sum(i["amount"] for i in incomes)
    rows = []
    for c in categories:
        budget = total_income * c["percent"] / 100
        spent = sum(t["amount"] for t in transactions if t["categoryId"] == c["id"])
        rows.append({
            "categoryId": c["id"],
            "category": c["name"],
            "percent": c["percent"],
            "budget": budget,
            "spent": spent,
            "remaining": budget - spent,
        })
    return jsonify(totalIncome=total_income, categories=rows)

if __name__ == "__main__":
    app.run(port=5000, debug=True)