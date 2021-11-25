export class PubSub {
    constructor() {
        this.events = {};
    }

    subscribe(type, cb) {
        const subscribers = this.events[type] = this.events[type] || [];
        if(subscribers.indexOf(cb) == -1) {
            subscribers.push(cb);
        } else {
            console.info((cb.name || cb), 'is already subscribed to "', type, '"');
        }
    }

    unsubscribe(type, cb) {
        const subscribers = this.events[type];
        if(subscribers) {
            const index = subscribers.indexOf(cb);
            if(index > -1) {
                subscribers.splice(index, 1);
            } else {
                console.info('could not unsubscribe "', (cb.name || cb), '" is not subscribed');
            }
        } else {
            console.info('could not unsubscribe event "', type, '" does not exist');
        }
    }

    publish(type, data = {}) {
        const subscribers = this.events[type];
        if(subscribers) {
            subscribers.forEach(subscriber => subscriber(data))
        } else {
            console.info('could not publish event "', type, '" does not exist');

        }
    }
}