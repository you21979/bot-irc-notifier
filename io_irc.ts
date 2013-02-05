///<reference path='typescript/node.d.ts'/>
var irc:any = require('irc');
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
     *  コンストラクタ
     */
    constructor(){}
    /**
     *  接続する
     */
    public connect(config:Config, cb:Callback):void{
        this.conn_ = new irc.Client(config.hostname, config.username, {
            debug: true,
            channels: config.channels,
        });
        this._setEvent(cb);
    }
    /**
     *  切断する
     */
    public disconnect():void{
        if(this.conn_){
            this.conn_.end();
            this.conn_ = null;
        }
    }
    /**
     *  メッセージを送信する
     */
    public send(channel:string, message:string):void{
        this.conn_.say(channel, message);
    }
    /**
     *  イベントを設定する
     */
    private _setEvent(cb:Callback):void{
        var self:Factory = this;
        this.conn_.addListener('error', (message:any):void=> {
            console.error('ERROR: %s: %s', message.command, message.args.join(' '));
        });
        this.conn_.addListener('message', (from:string, to:string, message:string):void=> {
            if ( to.match(/^[#&]/) ) {
                if(cb.chMessage){
                    cb.chMessage( self, from, to, message );
                }
            }
            else {
                // private message
                if(cb.privMessage){
                    cb.privMessage( self, from, to, message );
                }
            }
        });
        this.conn_.addListener('pm', (nick:string, message:string):void=> {
            console.log('Got private message from %s: %s', nick, message);
        });
        this.conn_.addListener('join', (channel:string, who:string):void=> {
            console.log('%s has joined %s', who, channel);
        });
        this.conn_.addListener('part', (channel:string, who:string, reason:string):void=> {
            console.log('%s has left %s: %s', who, channel, reason);
        });
        this.conn_.addListener('kick', (channel:string, who:string, by:string, reason:string):void=> {
            console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
        });
    }
}
