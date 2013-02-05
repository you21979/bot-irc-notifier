///<reference path='typescript/node.d.ts'/>
import fs = module('fs');
import ioirc = module('io_irc');
import ioredis = module('io_redis');

var config:any = JSON.parse(<string>fs.readFileSync(__dirname + '/config.json', 'utf-8'));

var cfgIRC:ioirc.Config = {
    hostname : config.irchostname,
    username : config.ircusername,
    channels : config.channels,
};
/**
 *  IRC側の処理
 */
var cbIRC:ioirc.Callback = {
    chMessage : (irc:ioirc.Factory, from:string, to:string, message:string):void => {
//        irc.send(to, message);
    },
    privMessage : (irc:ioirc.Factory, from:string, to:string, message:string):void => {
//        irc.send(from, message);
    },
};
var irc:ioirc.Factory = new ioirc.Factory();
irc.connect(cfgIRC, cbIRC);

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
