///<reference path='typescript/node.d.ts'/>
import fs = module('fs');
import ioirc = require('io_irc');
import ioredis = module('io_redis');

var config:any = JSON.parse(<string>fs.readFileSync(__dirname + '/config.json', 'utf-8'));

var irc = ioirc(config.irchostname, config.ircusername, config.channels);
irc.connect();

var cfgRedis:ioredis.Config = {
    hostname : config.redishostname,
    port : config.redisport,
    channels : config.channels,
};
/**
 *  REDIS側の処理 
 */
var cbRedis:ioredis.Callback = {
    chMessage : (redis:ioredis.Factory, channel:string, message:string):void => {
        irc.send(channel, message);
    },
};
var redis:ioredis.Factory = new ioredis.Factory();
redis.connect(cfgRedis, cbRedis);
