import { Gate } from './gateSystem/Gate';

export class User {

    firstName: string = 'Nil';
    gateSystem: Gate | any = null;

    public constructor(firstName: string) {
        this.firstName = firstName;
    }

    public createGateSystem(codeName: string): void{
        this.gateSystem = new Gate(codeName);
    }
}