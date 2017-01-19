'use strict';
// Load modules

const Stream = require('stream');

const Stringify = require('fast-safe-stringify');
const Logstash = require('logstash-client');
const Url = require('url');

// Declare internals

const internals = {
    defaults: {
        endpoint: 'tcp://localhost:8008',
        tags: []
    }
};

class GoodLogstash extends Stream.Writable {
    constructor(endpoint, options) {

        endpoint = endpoint || internals.defaults.endpoint;
        const url = Url.parse(endpoint);

        const tags = options && options.tags && Array.isArray(options.tags) ?
            options.tags :
            internals.defaults.tags;

        super({ objectMode: true, decodeStrings: false });
        this._client = new Logstash({
            type: url.protocol.replace(':', ''),
            host: url.hostname,
            port: url.port,
            format: (message) => {

                // Add custom global tags
                message.tags = message.tags ?
                    message.tags.concat(tags) :
                    tags;

                // Wrap log message strings as objects
                if (message.data && typeof message.data === 'string') {
                    message.data = { message: message.data };
                }

                if (message.data instanceof Error) {

                    const error = {
                        name    : message.data.name,
                        message : message.data.message,
                        stack   : message.data.stack
                    }

                    if (message.data.isBoom) {
                        error.statusCode = message.data.output.statusCode;
                        error.data = message.data.data
                    }
                    message.error = Object.assign({}, error);
                    delete message.data;
                }

                return Stringify(message);
            }

        });

        this.once('finish', () => {

            if (this._client.transport && this._client.transport.close) {
                this._client.transport.close();
            }
        });
    }
    _write(data, encoding, callback) {

        this._client.send(data, callback);
    }
}


module.exports = GoodLogstash;
