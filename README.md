# good-logstash

Logstash TCP/UDP broadcasting for Good process monitor.

[![Maintainers Wanted](https://img.shields.io/badge/maintainers-wanted-red.svg)](https://github.com/fhemberger/good-logstash/issues/5)
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

const init = async () => {
    await server.register({
        register: require('good'),
        options
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
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
