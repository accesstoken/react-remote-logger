# react-remote-logger
A remote logger for react

## Install

```
npm install react-remote-logger --save
```

## Usage

### Send logs to the server
Create a `.env` file on the root of your client app and set `REACT_APP_SEND_LOG_ENDPOINT` to the server's endpoint for receiving logs:

For example:

```txt
REACT_APP_SEND_LOG_ENDPOINT=http://myserver.com/api/logger
```

User `Logger` function to send logs to the server:

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

### Retrieve logs from the server

Create a `.env` on the root of your log viewer app to set `REACT_APP_RETRIEVE_LOGS_ENDPOINT` to the server's log retrieval endpoint:

For example:

```txt
REACT_APP_RETRIEVE_LOGS_ENDPOINT=http://myserver.com/api/logs
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

## LICENSE

MIT License

