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
    private conn_:any = null;
    /**
     *
     */
    constructor(){}
    /**
     *
     */
    public connect(config:Config, cb:Callback):void{
        this.conn_ = new irc.Client(config.hostname, config.username, {
            debug: true,
            channels: config.channels,
        });
        this._setEvent(cb);
    }
    /**
     *
     */
    public disconnect():void{
        if(this.conn_){
        }
    }
    /**
     *
     */
    public send(channel:string, message:string):void{
        this.conn_.say(channel, message);
    }
    /**
     *
     */
    private _setEvent(cb:Callback):void{
        var self:Factory = this;
        this.conn_.addListener('error', function(message) {
            console.error('ERROR: %s: %s', message.command, message.args.join(' '));
        });
        this.conn_.addListener('message', function (from, to, message) {
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
        this.conn_.addListener('pm', function(nick, message) {
            console.log('Got private message from %s: %s', nick, message);
        });
        this.conn_.addListener('join', function(channel, who) {
            console.log('%s has joined %s', who, channel);
        });
        this.conn_.addListener('part', function(channel, who, reason) {
            console.log('%s has left %s: %s', who, channel, reason);
        });
        this.conn_.addListener('kick', function(channel, who, by, reason) {
            console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
        });
    }
}
