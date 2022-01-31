import { Gate } from './Gate';
import { TimerSystem } from './TimerSystem';

export abstract class State {
    public gate: Gate;
    public delay: number;

    constructor(gate: Gate, delay: number = 10000) {
        this.gate = gate;
        this.delay = delay;
    }

    public abstract click(): void;
}

export class ClosedState extends State {

    public click(): void {
        this.gate.changeState(new MoveUpState(this.gate, this.delay));
    };
}

class OpenedState extends State {

    constructor(gate: Gate, delay: number = 10000){
        super(gate, delay);

        this.gate.sensor.observer.unsubscribeAll();
        this.gate.sensor.observer.subscribe(() => { this.click() });

        console.log('GATE IS OPEN');
    }

    public click(): void {
        this.gate.changeState(this.gate.sensor.noticed? new PendingState(this.gate, this.delay, MoveDownState) : new MoveDownState(this.gate, this.delay));
    };
    
}

class PendingState extends State {

    public nextState: any;

    constructor(gate: Gate, delay: number, nextState: any) {
        super(gate, delay);

        this.gate.sensor.observer.unsubscribeAll();
        this.gate.sensor.observer.subscribe(() => { this.click() });

        this.nextState = nextState; // НУЖНО СОСТОЯНИЕ СЕНСОРА СМОТРРЕТЬ
        console.log('PENDING!');
    }

    public click(): void {
        if (this.gate.sensor.noticed) {
            console.log('CLICK PEEEEEENDINGGGGG!!!');
        } else {
            this.gate.changeState(new this.nextState(this.gate, this.delay));
        }
    };
    
}

class MoveUpState extends State {

    public timer: TimerSystem;

    constructor(gate: Gate, delay: number) {
        super(gate, delay);
        this.timer = new TimerSystem(delay);
        this.timer.run( () => {this.click()} );

        console.log('GATE start MoveUP');
    }

    public click(): void {

        // if(this.gate.sensor.noticed){
        //     new PendingState(this.gate, this.delay);
        //     return;
        // }

        if(this.timer.stopMovement > Date.now()) {
            const remainingSec = this.timer.stopMovement - Date.now();
            console.log('Позавчасний виклик! Секунд до вiдкриття: ', remainingSec);

            this.timer.stop();
            this.gate.changeState(new MoveDownState(this.gate, this.delay - remainingSec));
        }
        else {
            this.gate.changeState(new OpenedState(this.gate));
        }
    };
    
}

class MoveDownState extends State {

    public timer: TimerSystem;
    
    constructor(gate: Gate, delay: number) {
        super(gate, delay);

        this.timer = new TimerSystem(delay);
        this.timer.run( () => {this.click()} );

        this.gate.sensor.observer.unsubscribeAll();
        this.gate.sensor.observer.subscribe(() => { this.click() });

        console.log('GATE start MoveDOWN');
    }

    public click(): void {

        if(this.timer.stopMovement > Date.now()) {
            const remainingSec = this.timer.stopMovement - Date.now();
            console.log('Позавчасний виклик або сенсор зафіксував автівку! Секунд до закриття: ', remainingSec);

            this.timer.stop();

            this.gate.changeState(this.gate.sensor.noticed ?
                new PendingState(this.gate, this.delay - remainingSec, MoveDownState) : 
                new MoveUpState(this.gate, this.delay - remainingSec));

        } else {
            this.gate.changeState(new ClosedState(this.gate));
        }
    };
    
}