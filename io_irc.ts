///<reference path='typescript/node.d.ts'/>
var irc = require('irc');
export interface Callback{
    chMessage(irc:Factory, from:string, to:string, message:string):void;
    privMessage(irc:Factory, from:string, to:string, message:string):void;
}
export interface Config{
    hostname:string;
    username:string;
    channels:string[];
}
export class Factory{
    private irc_:any = null;
    /**
     *
     */
    constructor(){}
    /**
     *
     */
    public connect(config:Config, cb:Callback):void{
        this.irc_ = new irc.Client(config.hostname, config.username, {
            debug: true,
            channels: config.channels,
        });
        this._setEvent(cb);
    }
    /**
     *
     */
    public disconnect():void{
        if(this.irc_){
        }
    }
    /**
     *
     */
    public send(channel:string, message:string):void{
        this.irc_.say(channel, message);
    }
    /**
     *
     */
    private _setEvent(cb:Callback):void{
        var self:Factory = this;
        this.irc_.addListener('error', function(message) {
            console.error('ERROR: %s: %s', message.command, message.args.join(' '));
        });
        this.irc_.addListener('message', function (from, to, message) {
            console.log('%s => %s: %s', from, to, message);
            if ( to.match(/^[#&]/) ) {
                if(cb.chMessage){
                    cb.chMessage( self, from, to, message );
                     //   if ( message.match(/hello/i) ) {
                }
            }
            else {
                // private message
                if(cb.privMessage){
                    cb.privMessage( self, from, to, message );
                }
            }
        });
        this.irc_.addListener('pm', function(nick, message) {
            console.log('Got private message from %s: %s', nick, message);
        });
        this.irc_.addListener('join', function(channel, who) {
            console.log('%s has joined %s', who, channel);
        });
        this.irc_.addListener('part', function(channel, who, reason) {
            console.log('%s has left %s: %s', who, channel, reason);
        });
        this.irc_.addListener('kick', function(channel, who, by, reason) {
            console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
        });
    }
}
