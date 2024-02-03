from flask import Flask, render_template, request, jsonify, g
import requests
import sqlite3
from urllib.parse import quote_plus
from flask_wtf.csrf import CSRFProtect





app = Flask(__name__)
app.config['SECRET_KEY'] = '1073'  # Replace 'your_secret_key_here' with a real secret key
csrf = CSRFProtect(app)


DATABASE = 'my_database.db'


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv


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


@app.route('/getCities')
def get_cities():
    state = request.args.get('state')
    zipCodeType = request.args.get('zipCodeType')

    if not state or not zipCodeType:
        return jsonify({"error": "State and zip code type are required"}), 400

    url = f"https://nae-api-sandbox.craftsman-book.com/Cities?state={state}&zipCodeType={zipCodeType}"
    headers = {
        "accept": "application/json",
        "api-key": "71cf353b-bf2d-4cd9-a2d8-5da741b1a4fe"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch data"}), response.status_code


@app.route('/performValuation', methods=['POST'])
def perform_valuation():
    data = request.json

    url = "https://nae-api-sandbox.craftsman-book.com/Valuations"
    headers = {
        "accept": "text/plain",
        "api-key": "71cf353b-bf2d-4cd9-a2d8-5da741b1a4fe",
        "Content-Type": "application/json"
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return jsonify(response.text)
    else:
        return jsonify({"error": "Failed to fetch data"}), response.status_code


@app.route('/getPropertyDetails', methods=['GET'])
def get_property_details():
    address1 = request.args.get('address1')
    address2 = request.args.get('address2')

    if not address1 or not address2:
        return jsonify({"error": "Address1 and Address2 are required"}), 400

    url = f"https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/expandedprofile?address1={quote_plus(address1)}&address2={quote_plus(address2)}"
    headers = {
        "accept": "application/json",
        "apikey": "7fea7d52e05c9b47dc3fc5a6741256f4"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch property details"}), response.status_code


@app.route('/scope')
def scope_of_work():
    quality_classes = query_db('SELECT DISTINCT "Quality Class" FROM prices_table')
    corners_options = query_db('SELECT DISTINCT Corners FROM prices_table')
    return render_template('scope.html',
                           quality_classes=[q[0] for q in quality_classes],
                           corners_options=[c[0] for c in corners_options])



@app.route('/quality-options')
def quality_options():
    quality_options = query_db("SELECT DISTINCT `Quality Class` FROM prices_table")
    return jsonify(quality_options)


@app.route('/corners-options')
def corners_options():
    corners_options = query_db("SELECT DISTINCT Corners FROM prices_table")
    return jsonify(corners_options)

#material costs

@app.route('/calculate-cost', methods=['POST'])
def calculate_cost():
    data = request.get_json()
    quality_class = data['quality-class']
    corners = data['corners']
    square_footage = int(data['square-footage'])

    # Assuming all square footage columns are in increments of 100
    # and the last column is for 5000 and above
    if square_footage >= 5000:
        sf_column_name = '"5000+"'
    else:
        # Round down to the nearest hundred for square footage
        rounded_sf = 100 * (square_footage // 100)
        sf_column_name = f'"{rounded_sf}"'  # Wrap column name in double quotes

    # Construct the SQL query
    query = f'SELECT {sf_column_name} FROM prices_table WHERE "Quality Class" = ? AND "Corners" = ?'
    cost = query_db(query, [quality_class, corners], one=True)

    if cost:
        return jsonify({'cost': cost[0]})
    else:
        return jsonify({'error': 'No matching data found'})





if __name__ == '__main__':
    app.run(debug=True)
