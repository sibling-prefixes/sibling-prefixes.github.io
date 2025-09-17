# sibling-prefixes.github.io

## How to Run?
### Python Packages
Create a python environment and install the packages.
```
python -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
```
My global python installation is a bit messed up so some of the packages might be unnecessary. All the more reason for you to use a python environment.
The notebook is how sibling_prefixes_data.json is created.

### Backend
Start the server
```
flask run
```

### Frontend
```
python -m http.server 8000
```
then open *http://localhost:8000/index.html* in a browser.

### Why do this?
If you simply open *index.html* in your browser, the GET Request won't be loaded due to CORS restrictions. Read more: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp


## What does each script do?
- duplicate_data.py: duplicates the original csv file. Replace <num_of_duplcates> with some number, eg. 100
    ```
    python python_scripts/duplicate_data.py <num_of_duplcates>
    ```