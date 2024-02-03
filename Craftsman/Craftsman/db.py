import sqlite3
import pandas as pd

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('my_database.db')

try:
    # Load your existing CSV data into a DataFrame
    df_nce = pd.read_csv('nce.csv')
    # Import the data into a new table called 'nce_table'
    df_nce.to_sql('nce_table', conn, if_exists='replace', index=False)

    # Load the prices CSV data into another DataFrame
    df_prices = pd.read_csv('prices.csv')
    # Import the data into a new table called 'prices_table'
    df_prices.to_sql('prices_table', conn, if_exists='replace', index=False)

    # Load the adjustments CSV data into another DataFrame
    df_adjustments = pd.read_csv('adjustments.csv')  # Replace with the path to your new CSV file
    # Import the data into a new table called 'zip_adjustments'
    df_adjustments.to_sql('zip_adjustments', conn, if_exists='replace', index=False)

except Exception as e:
    print(f"An error occurred: {e}")

finally:
    # Close the connection
    conn.close()
