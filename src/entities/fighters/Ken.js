import { Control } from "../../constants/control.js";
import { FighterState, FrameDelay, HurtBox, PushBox, FIGHTER_HURT_DELAY } from "../../constants/fighter.js";
import { playSound } from "../../engine/soundHandler.js";
import { Fighter } from "./Fighter.js";
import { Fireball } from "./special/Fireball.js";

export class Ken extends Fighter {
  voiceHadouken = document.querySelector('audio#sound-ken-voice-hadouken');
  fireball = { fired: false, strength: undefined};

  constructor(playerId, onAttackHit, entityList) {
    super(playerId, onAttackHit);
    this.entityList = entityList;
    this.image = document.querySelector('img[alt="ken"]');
    this.frames = new Map([
     // Idle stance
     ["idle-1", [[[346, 688, 60, 89],[34,86]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-2", [[[2, 687, 59, 90],[33,87]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-3", [[[72, 685, 58, 92],[32,89]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-4", [[[142, 684, 55, 93],[31,90]], PushBox.IDLE, HurtBox.IDLE]],

        // forwards move
      ["forwards-1", [[[8, 872, 53, 83],[27,81]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-2", [[[70, 867, 60, 88],[35,86]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-3", [[[148, 866, 64, 90],[35,87]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-4", [[[215, 865, 63, 89],[29,88]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-5", [[[288, 866, 54, 89],[25,87]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-6", [[[357, 867, 50, 89],[25,86]], PushBox.IDLE, HurtBox.FORWARD]],

      //backwards move
      ["backwards-1", [[[417, 868, 61, 87],[35,85]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-2", [[[487, 866, 59, 90],[36,87]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-3", [[[558, 865, 57, 90],[36,88]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-4", [[[629, 864, 58, 90],[38,89]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-5", [[[702, 865, 58, 91],[36,88]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-6", [[[773, 866, 57, 89],[36,87]], PushBox.IDLE, HurtBox.BACKWARD]],

      // Jump Up
      ["jumpUp-1", [[[724, 1036, 56, 104],[32,107]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-2", [[[792, 995, 50, 89],[25,103]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-3", [[[853, 967, 54, 77],[25,103]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-4", [[[911, 966, 48, 70],[28,101]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-5", [[[975, 977, 48, 86],[25,103]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-6", [[[1031, 1008, 55, 103],[32,107]], PushBox.JUMP, HurtBox.JUMP]],
      
      // Jump forwards/backwards
      ["jump-roll-1", [[[1237, 1037, 55, 103],[25,106]], PushBox.JUMP, [[-11,-106,24,16],[-26,-90,40,42],[-26,-31,40,32]]]],
      ["jump-roll-2", [[[1301, 990, 61, 78],[22,90]], PushBox.JUMP, [[17,-90,24,16],[-14,-91,40,42],[-22,-66,38,18]]]],
      ["jump-roll-3", [[[1363, 994, 104, 42],[61,76]], PushBox.JUMP, [[22,-51,24,16],[-14,-81,40,42],[-22,-66,38,18]]]],
      ["jump-roll-4", [[[1468, 957, 53, 82],[42,111]], PushBox.JUMP, [[-39,-46,24,16],[-30,-88,40,42],[-34,-118,44,48]]]],
      ["jump-roll-5", [[[1541, 988, 122, 44],[71,81]], PushBox.JUMP, [[-72,-56,24,16],[-54,-77,52,40],[-14,-82,48,34]]]],
      ["jump-roll-6", [[[1664, 976, 71, 87],[53,98]], PushBox.JUMP, [[-55,-100,24,16],[-48,-87,44,38],[-22,-66,38,18]]]],
      ["jump-roll-7", [[[1748, 977, 55, 103],[32,107]], PushBox.JUMP, [[-11,-106,24,16],[-26,-90,40,42],[-26,-31,40,32]]]],

      // Jump first/last frame
      ['jump-land', [[[660,1060,55,85],[29,83]], PushBox.IDLE, HurtBox.IDLE]],

      //crouch 
      ['crouch-1',[[[8,779,53,83],[27,81]], PushBox.IDLE, HurtBox.IDLE]],
      ['crouch-2',[[[79,794,57,69],[25,66]], PushBox.BEND, HurtBox.BEND]],
      ['crouch-3',[[[148,802,61,61],[25,58]], PushBox.CROUCH, HurtBox.CROUCH]],

      // Stand Turn
      ['idle-turn-1', [[[420,682,54,95],[29,92]], PushBox.IDLE, [[-10,-89,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],
      ['idle-turn-2', [[[488,678,58,98],[30,95]], PushBox.IDLE, [[-16,-96,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],
      ['idle-turn-3', [[[560,683,54,94],[27,90]], PushBox.IDLE, [[-16,-96,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],

      // Crouch Turn
      ['crouch-turn-1', [[[356,802,53,61],[26,58]], PushBox.CROUCH, [[-7,-60,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],
      ['crouch-turn-2', [[[424,802,52,61],[27,58]], PushBox.CROUCH, [[-7,-60,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],
      ['crouch-turn-3', [[[486,802,53,61],[29,58]], PushBox.CROUCH, [[-26,-61,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],

      // Light Punch
      ['light-punch-1', [[[3,1152,64,91],[32,88]], PushBox.IDLE, HurtBox.IDLE]],
      ['light-punch-2', [[[72,1152,92,91],[32,88]], PushBox.IDLE, HurtBox.IDLE, [11,-85,50,18]]],

      // Medium punch 
      ['med-punch-1', [[[517,1149,60,94],[28,91]], PushBox.IDLE, HurtBox.IDLE]],
      ['med-punch-2', [[[650,1148,74,95],[29,92]], PushBox.IDLE, HurtBox.PUNCH]],
      ['med-punch-3', [[[736,1148,108,94],[24,92]], PushBox.IDLE, HurtBox.PUNCH, [17,-85,68,14]]],
      
      // Heavy Punch
      ['heavy-punch-1', [[[736,1148,108,94],[24,92]], PushBox.IDLE, HurtBox.PUNCH, [17,-85,76,14]]],
      
      //Light Kick
      ['light-kick-1', [[[62,1565,66,92],[46,93]], PushBox.IDLE, [[-33,-96,30,18],[-41,-79,42,38],[-32,-52,44,50]]]],
      ['light-kick-2', [[[143,1565,114,92],[68,93]], PushBox.IDLE, [[-65,-96,30,18],[-57,-79,42,38],[-32,-52,44,50]], [-17,-98,66,28]]],

      // Medium Kick
      ['med-kick-1', [[[143,1565,114,92],[68,93]], PushBox.IDLE, [[-65,-96,30,18],[-57,-79,42,38],[-32,-52,44,50]],[-18,-98,80,28]]],

      // Heavy Kick
      ['heavy-kick-1', [[[683,1571,61,90],[37,87]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
      ['heavy-kick-2', [[[763,1567,95,94],[45,91]], PushBox.IDLE, [[12,-90,34,34],[-25,-78,42,42],[-11,-50,42,50]],[15,-99,40,32]]],
      ['heavy-kick-3', [[[870,1567,120,94],[42,91]], PushBox.IDLE, [[13,-91,62,34],[-25,-78,42,42],[-11,-50,42,50]],[21,-97,62,24]]],
      ['heavy-kick-4', [[[1005,1584,101,77],[39,74]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
      ['heavy-kick-5', [[[1147,1580,64,81],[38,78]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
    
      // Hit Face
      ['hit-face-1', [[[325,3275,62,91],[41,88]], PushBox.IDLE, [[-25,-89,20,20],[-33,-74,40,46],[-30,-37,40,38]]]],
      ['hit-face-2', [[[400,3279,68,88],[47,85]], PushBox.IDLE, [[-42,-88,20,20],[-46,-74,40,46],[-33,-37,40,38]]]],
      ['hit-face-3', [[[484,3279,73,88],[54,85]], PushBox.IDLE, [[-52,-87,20,20],[-53,-71,40,46],[-33,-37,40,38]]]],
      ['hit-face-4', [[[575,3274,83,93],[58,90]], PushBox.IDLE, [[-57,-88,20,20],[-53,-71,40,46],[-33,-37,40,38]]]],

      // Hit Stomach
      ['hit-stomach-1', [[[1,3279,58,85],[37,83]], PushBox.IDLE, [[-15,-85,28,18],[-31,-69,42,42],[-30,-34,42,34]]]],
      ['hit-stomach-2', [[[74,3282,66,82],[39,80]], PushBox.IDLE, [[-17,82,28,18],[-33,-65,38,36],[-34,-34,42,34]]]],
      ['hit-stomach-3', [[[149,3287,71,78],[47,75]], PushBox.IDLE, [[-17,82,28,18],[-41,-59,38,30],[-34,-34,42,34]]]],
      ['hit-stomach-4', [[[231,3293,75,72],[50,69]], PushBox.IDLE, [[-28,-67,28,18],[-41,-59,38,30],[-40,-34,42,34]]]],
      
      // Stunned
      ['stun-1', [[[149,3370,77,87],[28,85]], PushBox.IDLE, [[8,-87,28,18],[-16,-75,40,46],[-26,-31,40,32]]]],
      ['stun-2', [[[77,3368,65,89],[28,87]], PushBox.IDLE, [[-9,-89,28,18],[-23,-75,40,46],[-26,-31,40,32]]]],
      ['stun-3', [[[1,3367,67,90],[35,88]], PushBox.IDLE, [[-22,-91,28,18],[-30,-72,42,40],[-26,-31,40,32]]]],

      // Hadouken
      ['special-1', [[[3,2741,74,90],[28,89]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-2', [[[91,2747,85,83],[25,83]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-3', [[[188,2750,90,81],[25,80]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-4', [[[293,2754,106,77],[23,76]], PushBox.IDLE, [[38,-79,26,18],[21,-65,40,38],[-12,-30,78,30]]]],
    ]);

    this.animations = {
        [FighterState.IDLE]: [['idle-1',68],['idle-2',68],['idle-3',68],['idle-4',68],['idle-3',68],['idle-2',68]],
        [FighterState.WALK_FORWARD]: [['forwards-1',65],['forwards-2',65],['forwards-3',65],['forwards-4',65],['forwards-5',65],['forwards-6',65]],
        [FighterState.WALK_BACKWARD]: [['backwards-1',65],['backwards-2',65],['backwards-3',65],['backwards-4',65],['backwards-5',65],['backwards-6',65]],
        [FighterState.JUMP_START] : [['jump-land', 50],['jump-land',FrameDelay.TRANSITION]],
        [FighterState.JUMP_UP]: [['jumpUp-1',180],['jumpUp-2',100],['jumpUp-3',100],['jumpUp-4',100],['jumpUp-5',100],['jumpUp-6',-1]],
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
