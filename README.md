# sibling-prefixes.github.io

## Data
The data is stored in a directory named *data*. The python scripts need the csv file in *data/csvs/* and they generate the json files to *data/jsons/*. The frontend fetches the data from *data/jsons/* as a fallback option if no server is running.

## What about the Python scripts?
Create a python environment and install the packages. I am using Python 3.13.7.
```bash
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```
My global python installation is a bit messed up so some of the packages might be unnecessary. All the more reason for you to use a python environment.

The scripts are how monthly_aggregated_data.json is created.
```bash
cd python_scripts/
```

## What does each notebook do?
- duplicate_data.py: duplicates the original csv file. (No longer in use. We are using the actual csv files. Kept here for reference. Will probably be deleted later)
- aggregate_data_to_json.py: The script loads all CSV files, attaches a date/month derived from each filename, deduplicates per-month prefix pairs, computes per-month aggregates (mean Jaccard values and count of IPv4 prefixes), and writes the result as JSON.

## For now just run *aggregate_data_to_json* so you get the json needed to feed the frontend. 
