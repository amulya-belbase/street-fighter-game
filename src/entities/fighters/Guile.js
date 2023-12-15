import { Control } from "../../constants/control.js";
import { FighterState, FrameDelay, HurtBox, PushBox, FIGHTER_HURT_DELAY } from "../../constants/fighter.js";
import { playSound } from "../../engine/soundHandler.js";
import { Fighter } from "./Fighter.js";
import { Fireball } from "./special/Fireball.js";

export class Guile extends Fighter {
  voiceHadouken = document.querySelector('audio#sound-ken-voice-hadouken');
  fireball = { fired: false, strength: undefined};

  constructor(playerId, onAttackHit, entityList) {
    super(playerId, onAttackHit);
    this.entityList = entityList;
    this.image = document.querySelector('img[alt="guile"]');
    this.frames = new Map([
     // Idle stance
     ["idle-1", [[[22,393,75,90],[37,90]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-2", [[[124,393,74,90],[37,90]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-3", [[[226,393,75,90],[37,90]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-4", [[[328,393,76,90],[37,90]], PushBox.IDLE, HurtBox.IDLE]],

        // forwards move
      ["forwards-1", [[[17,553,84,91],[42,90]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-2", [[[145,551,68,91],[33,90]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-3", [[[264,548,59,92],[30,90]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-4", [[[374,549,58,93],[29,92]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-5", [[[485,554,60,90],[30,90]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-6", [[[430,394,76,89],[37,88]], PushBox.IDLE, HurtBox.FORWARD]],

      //backwards move
      ["backwards-1", [[[25,713,70,98],[35,98]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-2", [[[130,707,67,102],[33,100]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-3", [[[232,706,66,101],[33,100]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-4", [[[330,709,68,100],[34,100]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-5", [[[415,712,83,99],[41,99]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-6", [[[430,394,76,89],[35,89]], PushBox.IDLE, HurtBox.BACKWARD]],

      // Jump Up
      ["jumpUp-1", [[[377,894,73,81],[35,81]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-2", [[[477,870,68,106],[34,106]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-3", [[[563,870,65,90],[32,90]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-4", [[[645,870,57,78],[27,78]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-5", [[[726,870,51,66],[25,66]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-6", [[[645,870,57,78],[27,78]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-7", [[[563,870,65,90],[32,90]], PushBox.JUMP, HurtBox.JUMP]],
      
      // Jump forwards/backwards
      ["jump-roll-1", [[[18,1047,73,81],[36,81]], PushBox.JUMP, [[-11,-106,24,16],[-26,-90,40,42],[-26,-31,40,32]]]],
      ["jump-roll-2", [[[120,1022,78,106],[39,106]], PushBox.JUMP, [[17,-90,24,16],[-14,-91,40,42],[-22,-66,38,18]]]],
      ["jump-roll-3", [[[214,1030,88,60],[44,60]], PushBox.JUMP, [[22,-51,24,16],[-14,-81,40,42],[-22,-66,38,18]]]],
      ["jump-roll-4", [[[318,1029,81,58],[40,58]], PushBox.JUMP, [[-39,-46,24,16],[-30,-88,40,42],[-34,-118,44,48]]]],
      ["jump-roll-5", [[[416,1027,75,73],[37,73]], PushBox.JUMP, [[-72,-56,24,16],[-54,-77,52,40],[-14,-82,48,34]]]],
      ["jump-roll-6", [[[506,1034,88,55],[44,55]], PushBox.JUMP, [[-55,-100,24,16],[-48,-87,44,38],[-22,-66,38,18]]]],
      ["jump-roll-7", [[[18,1047,73,81],[36,81]], PushBox.JUMP, [[-11,-106,24,16],[-26,-90,40,42],[-26,-31,40,32]]]],

      // Jump first/last frame
      ['jump-land', [[[18,1047,73,81],[36,81]], PushBox.IDLE, HurtBox.IDLE]],

      //crouch 
      ['crouch-1',[[[18,895,73,81],[35,81]], PushBox.IDLE, HurtBox.IDLE]],
      ['crouch-2',[[[121,909,73,65],[35,65]], PushBox.BEND, HurtBox.BEND]],
      ['crouch-3',[[[212,913,67,63],[33,63]], PushBox.CROUCH, HurtBox.CROUCH]],

      // Stand Turn
      ['idle-turn-1', [[[27,1188,65,91],[32,91]], PushBox.IDLE, [[-10,-89,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],
      ['idle-turn-2', [[[123,1189,68,90],[34,90]], PushBox.IDLE, [[-16,-96,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],
      ['idle-turn-3', [[[212,1189,71,90],[35,90]], PushBox.IDLE, [[-16,-96,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],

      // Crouch Turn
      ['crouch-turn-1', [[[357,1216,67,63],[33,63]], PushBox.CROUCH, [[-7,-60,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],
      ['crouch-turn-2', [[[447,1217,70,62],[35,62]], PushBox.CROUCH, [[-7,-60,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],
      ['crouch-turn-3', [[[539,1217,63,62],[31,62]], PushBox.CROUCH, [[-26,-61,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],

      // Light Punch
      ['light-punch-1', [[[24,1394,73,91],[36,91]], PushBox.IDLE, HurtBox.IDLE]],
      ['light-punch-2', [[[113,1394,102,91],[50,91]], PushBox.IDLE, HurtBox.IDLE, [11,-85,50,18]]],

      // Medium punch 
      ['med-punch-1', [[[28,2201,67,96],[33,96]], PushBox.IDLE, HurtBox.IDLE]],
      ['med-punch-2', [[[211,2197,79,100],[38,100]], PushBox.IDLE, HurtBox.PUNCH]],
      ['med-punch-3', [[[448,2201,120,96],[60,96]], PushBox.IDLE, HurtBox.PUNCH, [17,-85,68,14]]],
      
      // Heavy Punch
      ['heavy-punch-1', [[[448,2201,120,96],[60,96]], PushBox.IDLE, HurtBox.PUNCH, [17,-85,76,14]]],
      
      //Light Kick
      ['light-kick-1', [[[24,2845,61,93],[30,93]], PushBox.IDLE, [[-33,-96,30,18],[-41,-79,42,38],[-32,-52,44,50]]]],
      ['light-kick-2', [[[204,2845,119,93],[59,93]], PushBox.IDLE, [[-65,-96,30,18],[-57,-79,42,38],[-32,-52,44,50]], [-17,-98,66,28]]],

      // Medium Kick
      ['med-kick-1', [[[180,3479,84,107],[42,107]], PushBox.IDLE, [[-65,-96,30,18],[-57,-79,42,38],[-32,-52,44,50]],[-18,-98,80,28]]],

      // Heavy Kick
      ['heavy-kick-1', [[[110,3653,68,100],[34,100]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
      ['heavy-kick-2', [[[201,3652,103,100],[51,100]], PushBox.IDLE, [[12,-90,34,34],[-25,-78,42,42],[-11,-50,42,50]],[15,-99,40,32]]],
      ['heavy-kick-3', [[[338,3644,76,107],[38,107]], PushBox.IDLE, [[13,-91,62,34],[-25,-78,42,42],[-11,-50,42,50]],[21,-97,62,24]]],
      ['heavy-kick-4', [[[442,3654,80,99],[40,99]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
      ['heavy-kick-5', [[[537,3649,70,102],[35,100]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
    
      // Hit Face
      ['hit-face-1', [[[42,6312,64,94],[32,94]], PushBox.IDLE, [[-25,-89,20,20],[-33,-74,40,46],[-30,-37,40,38]]]],
      ['hit-face-2', [[[132,6313,81,93],[40,93]], PushBox.IDLE, [[-42,-88,20,20],[-46,-74,40,46],[-33,-37,40,38]]]],
      ['hit-face-3', [[[228,6325,76,81],[38,81]], PushBox.IDLE, [[-52,-87,20,20],[-53,-71,40,46],[-33,-37,40,38]]]],
      ['hit-face-4', [[[132,6313,81,93],[40,93]], PushBox.IDLE, [[-57,-88,20,20],[-53,-71,40,46],[-33,-37,40,38]]]],

      // Hit Stomach
      ['hit-stomach-1', [[[34,6183,68,92],[34,92]], PushBox.IDLE, [[-15,-85,28,18],[-31,-69,42,42],[-30,-34,42,34]]]],
      ['hit-stomach-2', [[[129,6188,65,87],[32,87]], PushBox.IDLE, [[-17,82,28,18],[-33,-65,38,36],[-34,-34,42,34]]]],
      ['hit-stomach-3', [[[222,6195,70,80],[35,80]], PushBox.IDLE, [[-17,82,28,18],[-41,-59,38,30],[-34,-34,42,34]]]],
      ['hit-stomach-4', [[[129,6188,65,87],[32,87]], PushBox.IDLE, [[-28,-67,28,18],[-41,-59,38,30],[-40,-34,42,34]]]],
      
      // Stunned
      ['stun-1', [[[28,6818,67,92],[33,92]], PushBox.IDLE, [[8,-87,28,18],[-16,-75,40,46],[-26,-31,40,32]]]],
      ['stun-2', [[[123,6819,61,91],[30,91]], PushBox.IDLE, [[-9,-89,28,18],[-23,-75,40,46],[-26,-31,40,32]]]],
      ['stun-3', [[[212,6817,77,92],[38,92]], PushBox.IDLE, [[-22,-91,28,18],[-30,-72,42,40],[-26,-31,40,32]]]],

      // Hadouken
      ['special-1', [[[35,5150,68,86],[34,86]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-2', [[[123,5144,97,92],[48,92]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-3', [[[247,5151,93,85],[46,85]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-4', [[[353,5151,144,85],[72,85]], PushBox.IDLE, [[38,-79,26,18],[21,-65,40,38],[-12,-30,78,30]]]],
    ]);

    this.animations = {
        [FighterState.IDLE]: [['idle-1',68],['idle-2',68],['idle-3',68],['idle-4',68],['idle-3',68],['idle-2',68]],
        [FighterState.WALK_FORWARD]: [['forwards-1',65],['forwards-2',65],['forwards-3',65],['forwards-4',65],['forwards-5',65],['forwards-6',65]],
        [FighterState.WALK_BACKWARD]: [['backwards-1',65],['backwards-2',65],['backwards-3',65],['backwards-4',65],['backwards-5',65],['backwards-6',65]],
        [FighterState.JUMP_START] : [['jump-land', 50],['jump-land',FrameDelay.TRANSITION]],
        [FighterState.JUMP_UP]: [['jumpUp-1',180],['jumpUp-2',100],['jumpUp-3',100],['jumpUp-4',100],['jumpUp-5',100],['jumpUp-6',100],['jumpUp-7',-1]],
        [FighterState.JUMP_FORWARD]: [['jump-roll-1',200],['jump-roll-2',50],['jump-roll-3',50],['jump-roll-4',50],['jump-roll-5',50],['jump-roll-6',50],['jump-roll-7',FrameDelay.FREEZE]],
        [FighterState.JUMP_BACKWARD]: [['jump-roll-7',200],['jump-roll-6',50],['jump-roll-5',50],['jump-roll-4',50],['jump-roll-3',50],['jump-roll-2',50],['jump-roll-1', FrameDelay.FREEZE]],
        [FighterState.JUMP_LAND]: [['jump-land',33],['jump-land',117],['jump-land',FrameDelay.TRANSITION]],
        [FighterState.CROUCH]: [['crouch-3',FrameDelay.FREEZE]],
        [FighterState.CROUCH_DOWN]:[['crouch-1',30],['crouch-2',30],['crouch-3',30],['crouch-3',FrameDelay.TRANSITION]],
        [FighterState.CROUCH_UP]:[['crouch-3',30],['crouch-2',30],['crouch-1',30],['crouch-1',FrameDelay.TRANSITION]],
        [FighterState.IDLE_TURN]:[['idle-turn-3',33],['idle-turn-2',33],['idle-turn-1',33],['idle-turn-1',FrameDelay.TRANSITION],],
        [FighterState.CROUCH_TURN]:[['crouch-turn-3',33],['crouch-turn-2',33],['crouch-turn-1',33],['crouch-turn-1',FrameDelay.TRANSITION],],
        [FighterState.LIGHT_PUNCH]:[['light-punch-1', 33],['light-punch-2', 66],['light-punch-1', 66],['light-punch-1', FrameDelay.TRANSITION],],
        [FighterState.MEDIUM_PUNCH]:[['med-punch-1', 16],['med-punch-2', 33],['med-punch-3', 66],['med-punch-2', 50],['med-punch-1', 50],['med-punch-1', FrameDelay.TRANSITION]],
        [FighterState.HEAVY_PUNCH]:[['med-punch-1', 50],['med-punch-2', 33],['heavy-punch-1', 100],['med-punch-2', 166],['med-punch-1', 199],['med-punch-1', FrameDelay.TRANSITION]],
        [FighterState.LIGHT_KICK]:[['med-punch-1', 50],['light-kick-1', 50],['light-kick-2', 133],['light-kick-1', 66],['med-punch-1', 16],['med-punch-1', FrameDelay.TRANSITION]],
        [FighterState.MEDIUM_KICK]:[['med-punch-1', 83],['light-kick-1', 100],['med-kick-1', 199],['light-kick-1', 116],['light-kick-1', FrameDelay.TRANSITION]],
        [FighterState.HEAVY_KICK]:[['heavy-kick-1', 33],['heavy-kick-2', 66],['heavy-kick-3', 133],['heavy-kick-4', 166],['heavy-kick-5', 116],['heavy-kick-5', FrameDelay.TRANSITION]],
        [FighterState.HURT_HEAD_LIGHT]:[['hit-face-1', FIGHTER_HURT_DELAY],['hit-face-1', 50],['hit-face-2', 128],['hit-face-2', FrameDelay.TRANSITION]],
        [FighterState.HURT_HEAD_MEDIUM]:[['hit-face-1', FIGHTER_HURT_DELAY],['hit-face-1', 50],['hit-face-2', 66],['hit-face-3', 144],['hit-face-3', FrameDelay.TRANSITION]],
        [FighterState.HURT_HEAD_HEAVY]:[['hit-face-3', FIGHTER_HURT_DELAY],['hit-face-3', 112],['hit-face-4', 66],['stun-3', 144],['stun-3', FrameDelay.TRANSITION]],
        [FighterState.HURT_BODY_LIGHT]:[['hit-stomach-1', FIGHTER_HURT_DELAY],['hit-stomach-1', 176],['hit-stomach-1', FrameDelay.TRANSITION]],
        [FighterState.HURT_BODY_MEDIUM]:[['hit-stomach-1', FIGHTER_HURT_DELAY],['hit-stomach-1', 112],['hit-stomach-2',144],['hit-stomach-2', FrameDelay.TRANSITION]],
        [FighterState.HURT_BODY_HEAVY]:[['hit-stomach-2', FIGHTER_HURT_DELAY],['hit-stomach-2', 50],['hit-stomach-3', 66],['hit-stomach-4', 66],['stun-3',144],['stun-3', FrameDelay.TRANSITION]],
        [FighterState.SPECIAL_1]:[['special-1', 33], ['special-2', 128], ['special-3', 33], ['special-4', 640], ['special-4', FrameDelay.TRANSITION]],
      };
    this.initialVelocity = {
        x:{
            [FighterState.WALK_FORWARD]: 3*60,
            [FighterState.WALK_BACKWARD]: -(2*60),
            [FighterState.JUMP_FORWARD]: ((48*3)+(12*2)),
            [FighterState.JUMP_BACKWARD]: -((45*4)+(15*3)),
        },
        jump:-420,
    };
    this.gravity = 1000;
    
    this.states[FighterState.SPECIAL_1] = {
      init: this.handleHadoukenInit.bind(this),
      update: this.handleHadoukenState.bind(this),
      validFrom: [
        FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.IDLE_TURN, FighterState.CROUCH, 
        FighterState.CROUCH_DOWN, FighterState.CROUCH_UP, FighterState.CROUCH_TURN,
      ],
    }
    this.states[FighterState.IDLE].validFrom = [...this.states[FighterState.IDLE].validFrom, FighterState.SPECIAL_1];
  }

  handleHadoukenInit(){
    this.resetVelocities();
    playSound(this.voiceHadouken);
    this.fireball = { fired: false, strength: Control.HEAVY_PUNCH};
  }

  handleHadoukenState(time){
    if(!this.fireball.fired && this.animationFrame === 3){
        this.fireball.fired = true;
        this.entityList.add.call(this.entityList, Fireball, time, this, this.fireball.strength);
    }
    if(!this.isAnimationCompleted()) return;
    this.changeState(FighterState.IDLE);
  }

}
