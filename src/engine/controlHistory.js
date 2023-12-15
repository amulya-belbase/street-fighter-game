// import { Control } from '../constants/control.js';
// import { SpecialMoveDirection } from '../constants/fighter.js';
// import * as control from './InputHandler.js';

// const HISTORY_CAP = 10;

// export const controlHistory = [
//     [{
//         time: 0,
//         move: undefined,
//         buttons: [false,false,false,false,false,false],
//     }],
//     [{
//         time: 0,
//         move: undefined,
//         buttons: [false,false,false,false,false,false],
//     }],
// ];

// export const buttonOrder = [
//     Control.LIGHT_KICK, Control.MEDIUM_KICK, Control.HEAVY_KICK,
//     Control.LIGHT_PUNCH, Control.MEDIUM_PUNCH, Control.HEAVY_PUNCH,
// ];

// function getMoveDirection(controls){
//     if(controls.forward){
//         if(controls.down) return SpecialMoveDirection.FORWARD_DOWN;
//         if(controls.up) return SpecialMoveDirection.FORWARD_UP;
//         return SpecialMoveDirection.FORWARD;
//     }else if(controls.backward){
//         if(controls.down) return SpecialMoveDirection.BACKWARD_DOWN;
//         if(controls.up) return SpecialMoveDirection.BACKWARD_UP;
//         return SpecialMoveDirection.BACKWARD;
//     }else if(controls.down){
//         return SpecialMoveDirection.DOWN;
//     }else if(controls.up){
//         return SpecialMoveDirection.UP;
//     }
//     return SpecialMoveDirection.NONE;
// }

// function getCurrentControlSnapshot(time,id,direction){
//     const polledControls = {
//         forward: control.isForward(id,direction),
//         backward: control.isBackward(id, direction),
//         down: control.isDown(id),
//         up: control.isUp(id),
//     };
//     return{
//         time: time.previous,
//         move: getMoveDirection(polledControls),
//         buttons: buttonOrder.map((button) => control.isControlPressed(id,button)),
//     }
// }

// function isLastSnapshotDifferent(snapshot,id){
//     if(
//         controlHistory[id][0].move !== snapshot.mpve 
//         || controlHistory[id][0].buttons.some((button, index) => snapshot.buttons[index] !== button)
//     ) return true;
//     return false;
// }


// export function pollControl(time,id,direction){
//     const currentControlSnapshot = getCurrentControlSnapshot(time,id,direction);
//     if(!isLastSnapshotDifferent(currentControlSnapshot, id)) return;

//     if(id===0) console.log(currentControlSnapshot);

//     controlHistory[id].unshift(currentControlSnapshot);
//     if(controlHistory[id].length >= HISTORY_CAP) controlHistory[id].pop();
// }