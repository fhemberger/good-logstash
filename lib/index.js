'use strict';
// Load modules

const Stream = require('stream');

const Stringify = require('fast-safe-stringify');
const Logstash = require('logstash-client');
const Url = require('url');

// Declare internals

const internals = {
    defaults: {
        endpoint: 'tcp://localhost:8008'
    }
};

class GoodLogstash extends Stream.Writable {
    constructor(endpoint) {

        endpoint = endpoint || internals.defaults.endpoint;
        const url = Url.parse(endpoint);

        super({ objectMode: true, decodeStrings: false });
        this._client = new Logstash({
            type: url.protocol.replace(':', ''),
            host: url.hostname,
            port: url.port,
            format: (message) => Stringify(message)
        });

        this.once('finish', () => {

            this._write();
        });
    }
    _write(data, encoding, callback) {

        this._client.send(data, callback);
    }
}


module.exports = GoodLogstash;
