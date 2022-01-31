import * as readline from 'readline';
import { User } from './User';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const userRita = new User('Rita');
const myGate = userRita.createGateSystem('M2323');

console.log('Gate system code: %s', userRita.gateSystem.codeName);

// q - quit from system;
// s - change sensor a car or another thing in the zone of Gate System;
// c - send to gate signal by click the buttom.
// number of seconds (more then 10) - change number of seconds gate duration move.

rl.on('line', (input) => {
    console.log(`Signal: ${input}`);

    switch (input) {
        case 'q' : rl.close(); break;
        case 's' : {
            userRita.gateSystem.sensor.noticed = !userRita.gateSystem.sensor.noticed;
            console.log(userRita.gateSystem.sensor.noticed);
            break;
        }
        case 'c' : {
            console.log('OLD gate: %s', userRita.gateSystem.state.constructor.name);
            userRita.gateSystem.click();
            console.log('NEW gate: %s', userRita.gateSystem.state.constructor.name);
            break;
        }
        default : {
            if(Number(input) !== NaN){
                userRita.gateSystem.duration = Number(input);
            }
        } break;
    }
});
