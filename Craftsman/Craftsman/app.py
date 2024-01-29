from flask import Flask, render_template, request, jsonify
import requests
import pandas as pd



app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/property-details')
def property_details():
    return render_template('propertydetails.html')

@app.route('/mapbox')
def mapbox():
    return render_template('mapbox.html')

@app.route('/estimates')
def estimates():
    return render_template('estimates.html')

df = pd.read_csv('nce.csv')





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


from urllib.parse import quote_plus

@app.route('/getPropertyDetails', methods=['GET'])
def get_property_details():

    # Extract query parameters for address
    address1 = request.args.get('address1')
    address2 = request.args.get('address2')

    if not address1 or not address2:
        return jsonify({"error": "Address1 and Address2 are required"}), 400

    # Prepare the URL and headers for the Attom Data API
    url = f"https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/expandedprofile?address1={quote_plus(address1)}&address2={quote_plus(address2)}"
    headers = {
        "accept": "application/json",
        "apikey": "7fea7d52e05c9b47dc3fc5a6741256f4"  # Replace with your actual API key
    }

    # Make the API request
    response = requests.get(url, headers=headers)

    # Process the response
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch property details"}), response.status_code
# Existing routes...
    
@app.route('/get_descriptions')
def get_descriptions():
    descriptions = df['Category'].dropna().unique().tolist()
    return jsonify(descriptions)

@app.route('/get_material_cost', methods=['GET'])
def get_material_cost():
    description = request.args.get('description')
    try:
        matched_rows = df[df['Category'] == description]
        if not matched_rows.empty:
            cost = matched_rows['Lump sum cost'].iloc[0]
            return jsonify(cost)
        else:
            return jsonify({"error": "Description not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/search_descriptions')
def search_descriptions():
    query = request.args.get('query')
    matching_descriptions = df[df['Category'].str.contains(query, case=False, na=False)]['Category'].tolist()
    return jsonify(matching_descriptions)



if __name__ == '__main__':
    app.run(debug=True)


