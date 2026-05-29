from flask import Flask, request, jsonify
import os
import requests

app = Flask(__name__)

QUANTITY_FILE = "quantity"

FLOW_RATE_ML_PER_MINUTE = 400

DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1509724578971254944/RQFnKZS2hCGGqDNxiphr2clzvIdIS42rLQVSTXjpmB8RK3d0YJkNbAsf31PGNthTDhb_"

def send_discord_alert(message):
    payload = {
        "content": message
    }
    requests.post(DISCORD_WEBHOOK_URL, json=payload)

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

    if new_quantity > 5000:
        send_discord_alert(f"Bucket nearly full {int(new_quantity/100)/10.0}/10L!")

    save_quantity(new_quantity)

    return jsonify({
        "time_seconds": time_seconds,
        "added_ml": added_amount,
        "new_quantity": new_quantity
    })

@app.route("/empty", methods=["POST"])
def empty():
    save_quantity(0)

    return jsonify({
        "quantity": 0
    })


@app.route("/quantity", methods=["GET"])
def quantity():
    current_quantity = get_current_quantity()

    return jsonify({
        "quantity": current_quantity
    })


app.run(host="0.0.0.0", port=5001)