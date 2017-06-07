# good-logstash

[![Greenkeeper badge](https://badges.greenkeeper.io/fhemberger/good-logstash.svg)](https://greenkeeper.io/)

Logstash TCP/UDP broadcasting for Good process monitor.

![Current Version](https://img.shields.io/npm/v/good-logstash.svg)


## Usage

`good-logstash` is a write stream use to send event to remote TCP or UDP endpoints.

### Example

```javascript
// server.js

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection();

const options = {
    reporters: {
    	// Send only 'log' events to Logstash
        logstash: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*' }]
        }, {
            module: 'good-logstash',
            args: [
              'udp://prod.logs:8009',
              { tags: ['env:production', 'my-service'] }
            ]
        }]
    }
};

server.register({
    register: require('good'),
    options: options
}, (err) => {

    if (err) {
        console.error(err);
    } else {
        server.start(() => {

            console.info('Server started at ' + server.info.uri);
        });
    }
});

```


```
# logstash.conf

input {
  udp {
    port => 5000
    codec => "json"
  }
}

filter {
  json {
    source => "message"
  }
  if [codec] == "json" {
    date {
      match => ["timestamp", "UNIX_MS"]
      remove_field => ["timestamp"]
    }
  }
}

output {
  elasticsearch { hosts => "elasticsearch" }
  stdout { codec => rubydebug }
}
```

## Good Logstash
### GoodLogstash (endpoint)

Creates a new GoodLogstash object where:

- `endpoint` - TCP or UDP logging endpoint (defaults to `tcp://localhost:8008`)
- `options`:
  - `tags` - Array of additional global tags send to Logstash *(optional)*


## License

[MIT](LICENSE.txt)
