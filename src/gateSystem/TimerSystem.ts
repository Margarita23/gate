export class TimerSystem {
    public delay: number;
    public timer: any;
    public stopMovement: any;

    constructor(delay: number = 10000) {
        this.delay = delay;
    }

    run(callback: any) {
        this.stopMovement = Date.now() + this.delay;

        this.timer = setTimeout(() => {
            callback();
        }, this.delay);

    }

    stop() {
        console.log('STOP');
        clearTimeout(this.timer);
    }
}