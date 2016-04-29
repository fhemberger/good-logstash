# good-logstash

Logstash TCP/UDP broadcasting for Good process monitor.

![Current Version](https://img.shields.io/npm/v/good-logstash.svg)


## Usage

`good-logstash` is a write stream use to send event to remote TCP or UDP endpoints.

### Example

```javascript
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
            args: ['udp://prod.logs:8009']
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


## Good Logstash
### GoodLogstash (endpoint)

Creates a new GoodLogstash object where:

- `endpoint` - TCP or UDP logging endpoint (defaults to `tcp://localhost:8008`)


## License

[MIT](LICENSE.txt)
