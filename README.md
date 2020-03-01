# react-remote-logger
A remote logger for react

## Install

```
npm install react-remote-logger --save
```

## Usage

### Client Side: send logs from the client app to the server
Create a `.env` file on the root folder of your client app (the same level as the `package.json` file) and set `REACT_APP_SEND_LOG_ENDPOINT` to the server's endpoint which receives logs via the POST method:

```txt
REACT_APP_SEND_LOG_ENDPOINT=http://<your server endpoint for sending logs>
```

For example:
```txt
REACT_APP_SEND_LOG_ENDPOINT=http://example.com:5000/api/logger
```
If you don't have a server, you can setup a simple Flask/Python API using the code provided at the end of this file.

Install env-cmd package using the code below:
```
npm install env-cmd --save
```
Change the build section of the `package.json` to build the project with the environmental variables provided in the `.env` file.
```txt
 ...
 "scripts": {
    "start": "react-scripts start",
    "build": "env-cmd -f .env react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
 },
 ...
```


Now, you can easily use `Logger` function to send logs to the server:

```js
import {Logger} from "react-remote-logger";

function App() {
    Logger({
        'timestamp': (new Date()).toLocaleString(),
        'level': 'info',
        'message': 'this is a log from a client'
    });
    return (
        <div className="App">
          <p>Log sent to the server.</p>
        </div>
    )
}
export default App;
```
Logs can be a dictionary of any information you want to send via the Logger function (in the example above I used timestamp, level and message).



### Server Side: retrieve logs from the server

Create a `.env` file on the root of your log viewer app and set `REACT_APP_RETRIEVE_LOGS_ENDPOINT` to the server's log retrieval endpoint:

```txt
REACT_APP_RETRIEVE_LOGS_ENDPOINT=http://<your server endpoint for retrieving logs>
```
For example:

```txt
REACT_APP_RETRIEVE_LOGS_ENDPOINT=http://example.com:5000/api/logs
```

Use `useLogService` to retrieve the logs:

```js
import React from 'react';
import {useLogService} from 'react-remote-logger';

export default function LogViewer() {
    let service = useLogService();
    return (
        <div>
            {service.status === 'loading' && <div>Loading...</div>}
            {service.status === 'loaded' && <div>{service.payload}</div>} // you can create a table to show the logs
            {service.status === 'error' && <div>Error, the backend moved to the dark side.</div>}
        </div>
    );
}
```

***
### Setup a logging server using Flask and Python
Install flask and flask_cors:
```bash
pip install flask flask_cors
```

Create `app.py` containing the code below:
```python
#!/usr/bin/env python
import json
import flask
import os
from flask import jsonify
from io import StringIO
import flask_cors
import time

app = flask.Flask(__name__)
flask_cors.CORS(app, resources=r'/api/*')
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

PATH = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(PATH, 'logs/%s' % int(time.time()))


@app.route('/')
def index():
    return "Server is up!\nlogs will be stored in %s" % LOG_FILE


@app.route('/api/logs')
def read_logs():
    logs = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            for line in f.readlines():
                logs.append(json.loads(line))
    return jsonify(logs)


@app.route('/api/logger', methods=['GET', 'POST'])
def logger():
    result = flask.request.json
    buffer = StringIO()
    json.dump(result, buffer)
    buffer.write('\n')
    with open(LOG_FILE, 'a') as f:
        f.write(buffer.getvalue())
    return result


if __name__ == '__main__':
    app.debug = True
    app.run(port=5000)
```
Now you can start your server:

```$xslt
$ python app.py 
 * Serving Flask app "logger" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 328-216-763

```
## LICENSE

MIT License

