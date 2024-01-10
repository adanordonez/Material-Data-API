from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getCities')
def get_cities():
    state = request.args.get('state')
    zipCodeType = request.args.get('zipCodeType')  # Fetch zipCodeType from the request

    # Make sure both state and zipCodeType are provided
    if not state or not zipCodeType:
        return jsonify({"error": "State and zip code type are required"}), 400

    url = f"https://nae-api-sandbox.craftsman-book.com/Cities?state={state}&zipCodeType={zipCodeType}"
    headers = {
        "accept": "application/json",
        "api-key": "71cf353b-bf2d-4cd9-a2d8-5da741b1a4fe"  # Replace with your actual API key
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch data"}), response.status_code

@app.route('/performValuation', methods=['POST'])
def perform_valuation():
    # Extract data from the incoming request
    data = request.json

    url = "https://nae-api-sandbox.craftsman-book.com/Valuations"
    headers = {
        "accept": "text/plain",
        "api-key": "71cf353b-bf2d-4cd9-a2d8-5da741b1a4fe",  # Replace with your actual API key
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return jsonify(response.text)
    else:
        return jsonify({"error": "Failed to fetch data"}), response.status_code
    

if __name__ == '__main__':
    app.run(debug=True)
