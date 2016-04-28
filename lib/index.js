'use strict';
// Load modules

const Stream = require('stream');

const Stringify = require('fast-safe-stringify');
const Logstash = require('logstash-client');
const Url = require('url');

// Declare internals

const internals = {
    defaults: {
        url: 'tcp://localhost:8008'
    }
};

class GoodLogstash extends Stream.Writable {
    constructor(config) {

        config = config || {};
        const settings = Object.assign({}, internals.defaults, config);

        const url = Url.parse(settings.url);
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
