export class PubSub {

    constructor() {
        this.subscribers = {}
    }

    publish(eventName, data) {
        if(eventName in this.subscribers){
            this.subscribers[eventName].forEach(callback => {
                callback(data)
            })
        }
    }

    subscribe(eventName, callback) {
        if (!(eventName in this.subscribers))
            this.subscribers[eventName] = []
        this.subscribers[eventName].push(callback)
    }

}