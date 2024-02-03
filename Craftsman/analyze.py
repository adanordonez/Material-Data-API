import pandas as pd

# Load the CSV file
df = pd.read_csv('nce.csv')

# Get unique values for each category
unique_categories = df['Category'].unique()

# Print each unique category
for category in unique_categories:
    print(category)
