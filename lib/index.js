'use strict';
// Load modules

const Stream = require('stream');

const Stringify = require('fast-safe-stringify');
const Logstash = require('logstash-client');


// Declare internals

const internals = {
    defaults: {
        type: 'tcp',
        endpoint: 'localhost',
        port: 8008
    }
};

class GoodLogstash extends Stream.Writable {
    constructor(config) {

        config = config || {};
        const settings = Object.assign({}, internals.defaults, config);

        super({ objectMode: true, decodeStrings: false });
        this._client = new Logstash({
            type: settings.type,
            host: settings.host,
            port: settings.port,
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
