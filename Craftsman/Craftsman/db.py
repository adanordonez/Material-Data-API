import sqlite3
import pandas as pd

# Load your CSV data into a DataFrame
df = pd.read_csv('nce.csv')

# Connect to SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('my_database.db')

# Import the data into a new table called 'my_table'
df.to_sql('my_table', conn, if_exists='replace', index=False)

# Close the connection
conn.close()