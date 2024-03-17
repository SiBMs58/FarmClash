export class Ticker {
    constructor(_subscribers = []) {
        this.subscribers = [];
        for (let i = 0; i < _subscribers.length; i++) {
            this.addSubscriber(_subscribers[i]);
        }
        this.isRunning = false;
        this.tickSpeedMs = 1000 / 24; // 24 ticks per second
    }

    addSubscriber(instance) {
        if (instance && typeof instance.tick === 'function') {
            this.subscribers.push(instance); // Add instance to subscribers if it has a tick method
        } else {
            throw new Error (`Ticker: Instance (${instance.constructor.name}) does not have a tick method.`);
        }
    }

    async start() {
        this.isRunning = true;
        while (this.isRunning) { // Creates an infinite loop
            await new Promise(resolve => setTimeout(resolve, this.tickSpeedMs)); // Wait for 1/24th of a second
            this.subscribers.forEach(subscriber => subscriber.tick()); // Call tick on all subscribers
        }
    }

    stop() {
        this.isRunning = false;
    }
}




