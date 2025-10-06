# sibling-prefixes.github.io

## How to Run?
```
python -m http.server 8000
```
Or if you want to use npm
```
npx http-server
```
then open *http://localhost:8000/index.html* in a browser.

### Why do this?
If you simply open *index.html* in your browser, the .json files won't be loaded due to CORS restrictions. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp

### Data
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
- duplicate_data.py: duplicates the original csv file.
- aggregate_data_to_json.py: The script loads all CSV files, attaches a date/month derived from each filename, deduplicates per-month prefix pairs, computes per-month aggregates (mean Jaccard values and count of IPv4 prefixes), and writes the result as JSON.

## For now just run *duplicate_data* and then *aggregate_data_to_json* so you get the json needed to feed the frontend. Obviously, the data used currently is dummy.