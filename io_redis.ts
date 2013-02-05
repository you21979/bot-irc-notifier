///<reference path='typescript/node.d.ts'/>
var redis = require('redis');
export interface Callback{
    chMessage(redis:Factory, channel:string, message:string):void;
}
export interface Config{
    hostname:string;
    port:Number;
    channels:string[];
}
export class Factory{
    private conn_:any = null;
    private hostname_:string = null;
    private port_:Number = 0;
    /**
     *  コンストラクタ
     */
    constructor(){}
    /**
     *  接続する
     */
    public connect(config:Config, cb:Callback):void{
        var self:Factory = this;
        this.conn_ = new redis.createClient(config.port, config.hostname);
        config.channels.forEach((channel:string)=>{
            self.conn_.subscribe(channel);
        });
        this._setEvent(cb);
        this.port_ = config.port;
        this.hostname_ = config.hostname;
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
        var conn = redis.createClient(this.port_, this.hostname_);
        conn.publish(channel, message);
    }
    /**
     *  イベントを設定する
     */
    private _setEvent(cb:Callback):void{
        var self:Factory = this;
        this.conn_.on("error", (err:string):void=> {
            console.log("Error " + err);
        });
        this.conn_.on("message", (channel:string, message:string):void=> {
            console.log(channel + " :" + message);
            if(cb.chMessage){
                cb.chMessage(self, channel, message);
            }
        })
    }
}
