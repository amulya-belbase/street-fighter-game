import { Control } from "../../constants/control.js";
import { FighterState, FrameDelay, HurtBox, PushBox, FIGHTER_HURT_DELAY } from "../../constants/fighter.js";
import { playSound } from "../../engine/soundHandler.js";
import { Fighter } from "./Fighter.js";
import { Fireball } from "./special/Fireball.js";

export class Sagat extends Fighter {
  voiceHadouken = document.querySelector('audio#sound-ken-voice-hadouken');
  fireball = { fired: false, strength: undefined};

  constructor(playerId, onAttackHit, entityList) {
    super(playerId, onAttackHit);
    this.entityList = entityList;
    this.image = document.querySelector('img[alt="sagat"]');
    this.frames = new Map([
     // Idle stance
     ["idle-1", [[[13,430,74,117],[37,115]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-2", [[[100,428,74,119],[37,118]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-3", [[[187,427,74,120],[37,118]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-4", [[[274,428,74,119],[37,117]], PushBox.IDLE, HurtBox.IDLE]],

        // forwards move
      ["forwards-1", [[[13,647,74,119],[37,118]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-2", [[[103,646,71,121],[35,118]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-3", [[[199,645,62,123],[30,121]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-4", [[[283,644,65,124],[32,122]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-5", [[[373,645,62,123],[31,121]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-6", [[[451,646,71,121],[35,120]], PushBox.IDLE, HurtBox.FORWARD]],

      //backwards move
      ["backwards-1", [[[13,647,74,119],[37,118]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-2", [[[103,646,71,121],[35,118]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-3", [[[199,645,62,123],[30,121]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-4", [[[283,644,65,124],[32,122]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-5", [[[373,645,62,123],[31,121]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-6", [[[451,646,71,121],[35,120]], PushBox.IDLE, HurtBox.BACKWARD]],

      // Jump Up
      ["jumpUp-1", [[[13,844,74,95],[35,93]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-2", [[[110,793,61,132],[29,130]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-3", [[[202,782,67,96],[33,95]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-4", [[[300,768,61,77],[30,75]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-5", [[[392,782,67,96],[32,95]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-6", [[[482,793,61,132],[30,130]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-7", [[[556,844,74,95],[34,93]], PushBox.JUMP, HurtBox.JUMP]],
      
      // Jump forwards/backwards
      ["jump-roll-1", [[[13,844,74,95],[35,93]], PushBox.JUMP, [[-11,-106,24,16],[-26,-90,40,42],[-26,-31,40,32]]]],
      ["jump-roll-2", [[[110,793,61,132],[29,130]], PushBox.JUMP, [[17,-90,24,16],[-14,-91,40,42],[-22,-66,38,18]]]],
      ["jump-roll-3", [[[202,782,67,96],[33,95]], PushBox.JUMP, [[22,-51,24,16],[-14,-81,40,42],[-22,-66,38,18]]]],
      ["jump-roll-4", [[[300,768,61,77],[30,75]], PushBox.JUMP, [[-39,-46,24,16],[-30,-88,40,42],[-34,-118,44,48]]]],
      ["jump-roll-5", [[[392,782,67,96],[32,95]], PushBox.JUMP, [[-72,-56,24,16],[-54,-77,52,40],[-14,-82,48,34]]]],
      ["jump-roll-6", [[[482,793,61,132],[30,130]], PushBox.JUMP, [[-55,-100,24,16],[-48,-87,44,38],[-22,-66,38,18]]]],
      ["jump-roll-7", [[[556,844,74,95],[34,93]], PushBox.JUMP, [[-11,-106,24,16],[-26,-90,40,42],[-26,-31,40,32]]]],

      // Jump first/last frame
      ['jump-land', [[[13,430,74,117],[37,115]], PushBox.IDLE, HurtBox.IDLE]],

      //crouch 
      ['crouch-1',[[[13,548,74,95],[35,92]], PushBox.IDLE, HurtBox.IDLE]],
      ['crouch-2',[[[97,579,87,64],[42,64]], PushBox.BEND, HurtBox.BEND]],
      ['crouch-3',[[[13,1300,84,63],[42,60]], PushBox.CROUCH, HurtBox.CROUCH]],

      // Stand Turn
      ['idle-turn-1', [[[449,426,72,121],[36,120]], PushBox.IDLE, [[-10,-89,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],
      ['idle-turn-2', [[[533,425,71,122],[35,120]], PushBox.IDLE, [[-16,-96,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],
      ['idle-turn-3', [[[605,427,72,120],[36,120]], PushBox.IDLE, [[-16,-96,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],

      // Crouch Turn
      ['crouch-turn-1', [[[281,579,85,64],[42,62]], PushBox.CROUCH, [[-7,-60,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],
      ['crouch-turn-2', [[[368,579,80,64],[40,31]], PushBox.CROUCH, [[-7,-60,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],
      ['crouch-turn-3', [[[449,579,85,64],[42,62]], PushBox.CROUCH, [[-26,-61,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],

      // Light Punch
      ['light-punch-1', [[[14,950,91,112],[45,112]], PushBox.IDLE, HurtBox.IDLE]],
      ['light-punch-2', [[[121,959,130,103],[65,103]], PushBox.IDLE, HurtBox.IDLE, [11,-85,50,18]]],

      // Medium punch 
      ['med-punch-1', [[[365,940,77,121],[37,120]], PushBox.IDLE, HurtBox.IDLE]],
      ['med-punch-2', [[[456,950,91,112],[43,111]], PushBox.IDLE, HurtBox.PUNCH]],
      ['med-punch-3', [[[563,959,167,103],[82,102]], PushBox.IDLE, HurtBox.PUNCH, [17,-85,68,14]]],
      
      // Heavy Punch
      ['heavy-punch-1', [[[563,959,167,103],[82,102]], PushBox.IDLE, HurtBox.PUNCH, [17,-85,76,14]]],
      
      //Light Kick
      ['light-kick-1', [[[134,1532,94,124],[46,123]], PushBox.IDLE, [[-33,-96,30,18],[-41,-79,42,38],[-32,-52,44,50]]]],
      ['light-kick-2', [[[307,1549,131,108],[65,108]], PushBox.IDLE, [[-65,-96,30,18],[-57,-79,42,38],[-32,-52,44,50]], [-17,-98,66,28]]],

      // Medium Kick
      ['med-kick-1', [[[1051,1549,136,108],[68,108]], PushBox.IDLE, [[-65,-96,30,18],[-57,-79,42,38],[-32,-52,44,50]],[-18,-98,80,28]]],

      // Heavy Kick
      ['heavy-kick-1', [[[878,1532,94,124],[47,124]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
      ['heavy-kick-2', [[[973,1535,61,122],[30,120]], PushBox.IDLE, [[12,-90,34,34],[-25,-78,42,42],[-11,-50,42,50]],[15,-99,40,32]]],
      ['heavy-kick-3', [[[1800,1539,117,118],[57,118]], PushBox.IDLE, [[13,-91,62,34],[-25,-78,42,42],[-11,-50,42,50]],[21,-97,62,24]]],
      ['heavy-kick-4', [[[1188,1535,61,122],[30,122]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
      ['heavy-kick-5', [[[1280,1532,94,124],[47,124]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
    
      // Hit Face
      ['hit-face-1', [[[325,2682,66,123],[33,123]], PushBox.IDLE, [[-25,-89,20,20],[-33,-74,40,46],[-30,-37,40,38]]]],
      ['hit-face-2', [[[398,2684,78,121],[39,121]], PushBox.IDLE, [[-42,-88,20,20],[-46,-74,40,46],[-33,-37,40,38]]]],
      ['hit-face-3', [[[483,2686,77,119],[38,119]], PushBox.IDLE, [[-52,-87,20,20],[-53,-71,40,46],[-33,-37,40,38]]]],
      ['hit-face-4', [[[580,2686,79,119],[38,119]], PushBox.IDLE, [[-57,-88,20,20],[-53,-71,40,46],[-33,-37,40,38]]]],

      // Hit Stomach
      ['hit-stomach-1', [[[179,2934,74,119],[37,119]], PushBox.IDLE, [[-15,-85,28,18],[-31,-69,42,42],[-30,-34,42,34]]]],
      ['hit-stomach-2', [[[8,2695,94,110],[46,110]], PushBox.IDLE, [[-17,82,28,18],[-33,-65,38,36],[-34,-34,42,34]]]],
      ['hit-stomach-3', [[[107,2706,103,99],[51,98]], PushBox.IDLE, [[-17,82,28,18],[-41,-59,38,30],[-34,-34,42,34]]]],
      ['hit-stomach-4', [[[211,2709,105,96],[52,96]], PushBox.IDLE, [[-28,-67,28,18],[-41,-59,38,30],[-40,-34,42,34]]]],
      
      // Stunned
      ['stun-1', [[[1,3056,78,121],[39,121]], PushBox.IDLE, [[8,-87,28,18],[-16,-75,40,46],[-26,-31,40,32]]]],
      ['stun-2', [[[94,3054,66,123],[33,123]], PushBox.IDLE, [[-9,-89,28,18],[-23,-75,40,46],[-26,-31,40,32]]]],
      ['stun-3', [[[179,3058,74,119],[37,119]], PushBox.IDLE, [[-22,-91,28,18],[-30,-72,42,40],[-26,-31,40,32]]]],

      // Hadouken
      ['special-1', [[[13,430,74,117],[37,115]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-2', [[[3,2129,70,123],[35,122]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-3', [[[96,2144,92,108],[41,108]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-4', [[[203,2151,152,101],[152,101]], PushBox.IDLE, [[38,-79,26,18],[21,-65,40,38],[-12,-30,78,30]]]],
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
