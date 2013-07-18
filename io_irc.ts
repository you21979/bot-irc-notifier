///<reference path='typescript/node.d.ts'/>
var irc:any = require('irc');


class AIEvent{
    public onMessage:(from:string, to:string, message:string)=>void;
    constructor(){
        this.onMessage = (from:string, to:string, message:string):void=>{}
    }
}



class IRC{
    private conn:any = null;
    public aie:AIEvent = new AIEvent();
    /**
     *  コンストラクタ
     */
    constructor(
        public hostname:string,
        public username:string,
        public channels:string[]
    ){}
    /**
     *  接続する
     */
    public connect():void{
        if(!this.conn){
            this.conn = new irc.Client(this.hostname, this.username, {
                debug: true,
                channels: this.channels,
            });
            this.conn.on('message', (from:string, to:string, message:string):void=> {
                if ( to.match(/^[#&]/) ) {
                    this.aie.onMessage( from, to, message );
                }
                else {
                    // private message
                }
            });
            this.conn.on('error', (message:any):void=> {
                console.error('ERROR: %s: %s', message.command, message.args.join(' '));
            });
            this.conn.on('pm', (nick:string, message:string):void=> {
                console.log('Got private message from %s: %s', nick, message);
            });
            this.conn.on('join', (channel:string, who:string):void=> {
                console.log('%s has joined %s', who, channel);
            });
            this.conn.on('part', (channel:string, who:string, reason:string):void=> {
                console.log('%s has left %s: %s', who, channel, reason);
            });
            this.conn.on('kick', (channel:string, who:string, by:string, reason:string):void=> {
                console.log('%s was kicked from %s by %s: %s', who, channel, by, reason);
            });
        }
    }
    /**
     *  切断する
     */
    public disconnect():void{
        if(this.conn){
            this.conn.end();
            this.conn = null;
        }
    }
    /**
     *  メッセージを送信する
     */
    public send(channel:string, message:string):void{
        this.conn.say(channel, message);
    }
    /**
     */
    public join(channel:string):void{
    }
    public setEventMessage(message:(from:string, to:string, message:string)=>void):void{
        this.aie.onMessage = message;
    }
}
var factory = (hostname:string, username:string, channels:string[])=>new IRC(hostname, username, channels)
export = factory
