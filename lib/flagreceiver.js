var UserDataParser = require('./userdataparser'),
    EventEmitter = require('events').EventEmitter,
    util = require('util'),
    _ = require('underscore');

module.exports = FlagReceiver;

function UserConnection(socket) {
    EventEmitter.call(this);

    var parser = new UserDataParser();
    this.socket = socket;

    socket.on('close', _.bind(function() {
        this.emit('close');
    }, this));

    socket.on('error', function() {});

    socket.on('data', _.bind(function(d) {
        parser.append(d);
    }, this));

    parser.on('TEAM', _.bind(function(name) {
        this.emit('team', name);
    }, this));

    parser.on('FLAG', _.bind(function(flag) {
        if (flag.match(/^[0-9a-f]{64}$/i)) {
            this.emit('flag', flag);
        }
    }, this));
};
util.inherits(UserConnection, EventEmitter);

function FlagReceiver(server) {
    EventEmitter.call(this);

    server.on('connection', _.bind(function(socket) {
        socket.setEncoding('utf8');
        var con = new UserConnection(socket);
        this.emit('connection', con);
    }, this));
};
util.inherits(FlagReceiver, EventEmitter);
