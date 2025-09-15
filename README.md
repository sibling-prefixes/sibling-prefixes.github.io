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

### Data
The data is stored in a directory named *data*. The python notebooks need the csv files in *data/csvs/* and they generate the json files to *data/jsons/*. The frontend fetches the data from *data/jsons/*.

### Why do this?
If you simply open *index.html* in your browser, the .json files won't be loaded due to CORS restrictions. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp

## What about the ipynb notebook?
Create a python environment and install the packages.
```
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```
My global python installation is a bit messed up so some of the packages might be unnecessary. All the more reason for you to use a python environment.
The notebook is how sibling_prefixes_data.json is created.

## What does each notebook do?
- duplicate_data.ipynb: duplicates the original csv file.
- extract_timestamp.ipynb: combines the csvs from *data/csvs/* and exports it to a *combined_sibling_prefixes_data.json* into *data/jsons/*
- generate_timestamps.ipynb: generate a random timestamp for each datapoint in a csv and then export the data to *sibling_prefixes_data.json*

## For now just run duplicate_data and then extract_timestamp so you get the json needed to feed the frontend.