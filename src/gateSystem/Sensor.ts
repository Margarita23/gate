export class Sensor {

    public observer: EventObserver = new EventObserver();
    private _noticed: boolean = false;

    public get noticed(): boolean {
        return this._noticed;
    }

    public set noticed(newNoticed: boolean) {
        this._noticed = newNoticed;
        this.observer.broadcast();
    }

}

export class EventObserver {

    public observers: Array<any>;

    constructor () {
      this.observers = [];
    }
  
    subscribe (fn: any) {
      this.observers.push(fn);
    }
  
    unsubscribe (fn: any) {
      this.observers = this.observers.filter(subscriber => subscriber !== fn);
    }

    unsubscribeAll () {
        this.observers = [];
      }
  
    broadcast (data?: any) {
        this.observers.forEach(subscriber => subscriber(data));
    }
}
