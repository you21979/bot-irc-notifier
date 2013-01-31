///<reference path='node.d.ts'/>
var irc = require('irc');
module Bot {
    export function main(config){

        var bot = new irc.Client(config.hostname, config.botname, {
            debug: true,
            channels: config.channels,
        });

        bot.addListener('error', function(message) {
            console.error('ERROR: %s: %s', message.command, message.args.join(' '));
        });

        bot.addListener('message', function (from, to, message) {
            //bot.say(to, "botdesu");
            console.log('%s => %s: %s', from, to, message);

            if ( to.match(/^[#&]/) ) {
                // channel message
                if ( message.match(/hello/i) ) {
                    bot.say(to, "hello");
                }
            }
            else {
                // private message
            }
        });
        bot.addListener('pm', function(nick, message) {
            console.log('Got private message from %s: %s', nick, message);
        });
        bot.addListener('join', function(channel, who) {
            console.log('%s has joined %s', who, channel);
        });
        bot.addListener('part', function(channel, who, reason) {
            console.log('%s has left %s: %s', who, channel, reason);
        });
        bot.addListener('kick', function(channel, who, by, reason) {
            console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
        });
    }
}
exports.main = Bot.main;
