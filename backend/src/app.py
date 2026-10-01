from flask import Flask, jsonify, request
from flask_cors import CORS

from datetime import date

MESSAGES = {
    "en": {
        "over": "{name} is R{amount} past your plan this month.",
        "warning": "You have used {used}% of your {name} plan.",
        "on_track": "You are on track this month.",
    },
    # add a second language here, same three keys
}

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
            "type": data.get("type", "spend"),   # "spend" or "remittance"
            "categoryId": data.get("categoryId"),
            "amount": data["amount"],
            "description": data.get("description"),
            "date": data.get("date", date.today().isoformat()),
        }
        transactions.append(item)
        return jsonify(item), 201
    return jsonify(transactions)

# ---------- Summary ----------
@app.route("/summary")
def summary():
    msgs = MESSAGES.get(request.args.get("lang", "en"), MESSAGES["en"])
    total_income = sum(i["amount"] for i in incomes)
    rows, guidance = [], []

    for c in categories:
        budget = total_income * c["percent"] / 100
        spent = sum(t["amount"] for t in transactions if t["categoryId"] == c["id"])
        used = (spent / budget * 100) if budget > 0 else 0
        if spent > budget:
            status = "over"
            guidance.append(msgs["over"].format(name=c["name"], amount=round(spent - budget)))
        elif used >= 80:
            status = "warning"
            guidance.append(msgs["warning"].format(name=c["name"], used=round(used)))
        else:
            status = "ok"
        rows.append({
            "categoryId": c["id"], "category": c["name"], "percent": c["percent"],
            "budget": budget, "spent": spent, "remaining": budget - spent, "status": status,
        })

    if not guidance:
        guidance.append(msgs["on_track"])

    total_spent = sum(r["spent"] for r in rows)
    total_remitted = sum(t["amount"] for t in transactions if t["type"] == "remittance")
    savings_percent = max(0, 100 - sum(c["percent"] for c in categories))

    return jsonify(
        totalIncome=total_income,
        totalSpent=total_spent,
        totalRemitted=total_remitted,
        leftover=total_income - total_spent - total_remitted,
        savings={"percent": savings_percent,
                 "planned": total_income * savings_percent / 100},
        categories=rows,
        guidance=guidance,
    )

goals = []

@app.route("/goals", methods=["GET", "POST"])
def goals_route():
    if request.method == "POST":
        d = request.get_json()
        g = {"id": new_id(), "name": d["name"], "target": d["target"], "saved": d.get("saved", 0)}
        goals.append(g)
        return jsonify(g), 201
    return jsonify([
        {**g,
         "left": max(0, g["target"] - g["saved"]),
         "percent": round(g["saved"] / g["target"] * 100) if g["target"] else 0}
        for g in goals
    ])

@app.route("/goals/<int:gid>/save", methods=["POST"])
def save_to_goal(gid):
    amount = request.get_json()["amount"]
    for g in goals:
        if g["id"] == gid:
            g["saved"] += amount
            return jsonify(g)
    return jsonify(error="Goal not found"), 404

@app.route("/seed", methods=["POST"])
def seed():
    for lst in (incomes, categories, transactions, goals):
        lst.clear()
    incomes.append({"id": new_id(), "amount": 6000, "source": "Salary"})
    cats = {n: {"id": new_id(), "name": n, "percent": p}
            for n, p in [("Groceries", 30), ("Transport", 15), ("Airtime", 5)]}
    categories.extend(cats.values())

    sample = [
        ("spend", "Groceries", 450, "Shoprite", "2026-09-02"),
        ("spend", "Groceries", 520, "Pick n Pay", "2026-09-12"),
        ("spend", "Groceries", 380, "Spar", "2026-09-23"),
        ("spend", "Transport", 600, "Taxi fare", "2026-09-05"),
        ("spend", "Transport", 350, "Taxi fare", "2026-09-19"),
        ("spend", "Airtime", 150, "Airtime", "2026-09-08"),
        ("remittance", None, 1000, "Sent home", "2026-09-03"),
        ("remittance", None, 800, "Sent home", "2026-09-17"),
    ]
    for t_type, cat, amount, desc, d in sample:
        transactions.append({
            "id": new_id(), "type": t_type,
            "categoryId": cats[cat]["id"] if cat else None,
            "amount": amount, "description": desc, "date": d,
        })
    goals.append({"id": new_id(), "name": "School fees", "target": 2000, "saved": 600})
    return jsonify(message="Sample data loaded")
if __name__ == "__main__":
    app.run(port=5000, debug=True)