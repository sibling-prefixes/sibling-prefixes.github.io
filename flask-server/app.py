from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import pandas as pd
import datetime as dt

app = Flask(__name__)
CORS(app, origins=["http://localhost:8000"])

DATA_DIR = '../data/csvs/'

# IMPORTANT: Current implementation loads and processes all CSV files on server startup.
# This is fine for a moderate number of files, but may not scale well with a large number of files or very large files.
# Consider processing data in chunks or using a database for larger datasets.
def load_and_aggregate_data():
    dfs = []
    csv_files = [f for f in os.listdir(DATA_DIR) if f.endswith('.csv')]

    for csv_file in csv_files:
        # Extract the date part (first 8 characters before the first '_')
        date_str = csv_file.split('_')[0]  # e.g., '20240904'
        
        # Convert to datetime object (assuming YYYYMMDD format)
        date_obj = dt.datetime.strptime(date_str, '%Y%m%d')
        
        timestamp = int(date_obj.timestamp())

        df = pd.read_csv(os.path.join(DATA_DIR, csv_file))
        df['timestamp'] = timestamp
        df['date'] = pd.to_datetime(df['timestamp'], unit='s')
        df['month'] = df['date'].dt.to_period('M').astype(str)

        dfs.append(df)

        print(f"Loaded {csv_file} with {len(df)} unique rows.")

    if dfs:
        combined_df = pd.concat(dfs, ignore_index=True)
        # print("Rows per month in combined_df (before deduplication):")
        # print(combined_df.groupby('month').size())

        # Remove duplicates pairs of ipv4_prefix_bgp, and ipv6_prefix_bgp by month
        combined_df = combined_df.drop_duplicates(subset=['month', 'ipv4_prefix_bgp', 'ipv6_prefix_bgp'])

        # print("Rows per month in combined_df (after deduplication):")
        # print(combined_df.groupby('month').size())

        # Aggregate by month
        monthly_agg = combined_df.groupby('month').agg({
            'jac_val_bgp': 'mean',
            'jac_val_cidr': 'mean',
            'ipv4_prefix_bgp': 'count'
        }).reset_index()

        return monthly_agg.to_dict('records')
    return []

# TODO : Setup a watcher on DATA_DIR to reload data when new files are added or existing files are modified. Look in to watchdog library. 
# Only do this if current apporach is the one we want to stick with. Otherwise, this is not needed.

aggregated_data = None
print("Loading data on server startup...")
aggregated_data = load_and_aggregate_data()  
print("Data loaded. Starting server...")

@app.route("/get_monthly_data", methods=['GET'])
def get_monthly_data():
    if request.method == 'GET':
        return jsonify(aggregated_data)
    else:
        return jsonify({"error": "Invalid request method"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)