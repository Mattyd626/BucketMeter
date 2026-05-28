from flask import Flask, request, jsonify
import os

app = Flask(__name__)

QUANTITY_FILE = "quantity"

FLOW_RATE_ML_PER_MINUTE = 400


def get_current_quantity():
    if not os.path.exists(QUANTITY_FILE):
        with open(QUANTITY_FILE, "w") as f:
            f.write("0")

    with open(QUANTITY_FILE, "r") as f:
        return float(f.read().strip())


def save_quantity(quantity):
    with open(QUANTITY_FILE, "w") as f:
        f.write(str(quantity))


@app.route("/fill", methods=["POST"])
def fill():
    data = request.get_json()

    if not data or "time" not in data:
        return jsonify({
            "error": "Missing 'time' parameter"
        }), 400

    try:
        time_seconds = float(data["time"])
    except ValueError:
        return jsonify({
            "error": "'time' must be a number"
        }), 400


    added_amount = FLOW_RATE_ML_PER_MINUTE * (time_seconds / 60.0)

    current_quantity = get_current_quantity()

    new_quantity = current_quantity + added_amount

    save_quantity(new_quantity)

    return jsonify({
        "time_seconds": time_seconds,
        "added_ml": added_amount,
        "new_quantity_ml": new_quantity
    })


@app.route("/quantity", methods=["GET"])
def quantity():
    current_quantity = get_current_quantity()

    return jsonify({
        "quantity_ml": current_quantity
    })


app.run(host="0.0.0.0", port=5001)