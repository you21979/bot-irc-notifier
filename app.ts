///<reference path='typescript/node.d.ts'/>
import fs = module('fs');
import ioirc = module('io_irc');

var config = JSON.parse(<string>fs.readFileSync(__dirname + '/config.json', 'utf-8'));

var cfg:ioirc.Config = {
    hostname : config.hostname,
    username : config.username,
    channels : config.channels,
};
var cb:ioirc.Callback = {
    chMessage : (irc:ioirc.Factory, from:string, to:string, message:string):void => {
        irc.send(to, message);
    },
    privMessage : (irc:ioirc.Factory, from:string, to:string, message:string):void => {
        irc.send(from, message);
    },
};
var irc:ioirc.Factory = new ioirc.Factory();
irc.connect(config, cb);


