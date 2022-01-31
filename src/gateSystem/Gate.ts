import { State, ClosedState } from './State';
import { Sensor } from './Sensor';

export class Gate {

    private _duration: number = 10000;

    public state: State;
    public currentState: string = 'close';
    public codeName: string = '';
    public sensor: Sensor = new Sensor();

    public get duration(): number {
        return this._duration;
    }

    public set duration(newDuration: number) {
        if (this.state.constructor.name !== 'ClosedState' &&
            this.state.constructor.name !== 'OpenedState'&&
            this.state.constructor.name !== 'PendingState') {
            console.log('Your gate should be closed or opened to change guration');
            return;
        } else if (newDuration < 10) {
            console.log('Gate duration should be more then 10 sec');
        }

        this._duration = newDuration*1000;
        this.state.delay = this._duration;
    }

    public constructor(codeName: string) {
        this.codeName = codeName;
        this.state = new ClosedState(this, this.duration);
    }

    public click(): void {
        this.state.click();
    }

    public changeState(state: State): void {
        this.state = state;
    }
    
}
