import { Control } from "../../constants/control.js";
import { FighterState, FrameDelay, HurtBox, PushBox, FIGHTER_HURT_DELAY } from "../../constants/fighter.js";
import { playSound } from "../../engine/soundHandler.js";
import { Fighter } from "./Fighter.js";
import { Fireball } from "./special/Fireball.js";

export class Balrog extends Fighter {
  voiceHadouken = document.querySelector('audio#sound-ken-voice-hadouken');
  fireball = { fired: false, strength: undefined};

  constructor(playerId, onAttackHit, entityList) {
    super(playerId, onAttackHit);
    this.entityList = entityList;
    this.image = document.querySelector('img[alt="balrog"]');
    this.frames = new Map([
     // Idle stance
     ["idle-1", [[[25,393,70,100],[35,100]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-2", [[[109,392,71,101],[35,100]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-3", [[[195,391,73,102],[36,100]], PushBox.IDLE, HurtBox.IDLE]],
     ["idle-4", [[[282,390,74,103],[37,100]], PushBox.IDLE, HurtBox.IDLE]],

        // forwards move
      ["forwards-1", [[[25,550,60,101],[30,101]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-2", [[[113,548,66,103],[33,100]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-3", [[[202,545,83,104],[41,100]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-4", [[[309,546,91,102],[45,100]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-5", [[[426,549,90,99],[45,100]], PushBox.IDLE, HurtBox.FORWARD]],
      ["forwards-6", [[[540,550,60,100],[30,100]], PushBox.IDLE, HurtBox.FORWARD]],

      //backwards move
      ["backwards-1", [[[22,702,68,101],[34,100]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-2", [[[118,704,90,99],[45,100]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-3", [[[230,700,91,103],[45,100]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-4", [[[353,698,87,105],[43,102]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-5", [[[472,699,72,104],[36,102]], PushBox.IDLE, HurtBox.BACKWARD]],
      ["backwards-6", [[[574,701,68,102],[34,102]], PushBox.IDLE, HurtBox.BACKWARD]],

      // Jump Up
      ["jumpUp-1", [[[384,891,58,85],[29,85]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-2", [[[473,852,68,124],[34,124]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-3", [[[561,862,59,97],[29,97]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-4", [[[638,862,60,81],[30,81]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-5", [[[715,848,59,113],[29,113]], PushBox.JUMP, HurtBox.JUMP]],
      ["jumpUp-6", [[[715,848,59,113],[29,113]], PushBox.JUMP, HurtBox.JUMP]],
      
      // Jump forwards/backwards
      ["jump-roll-1", [[[25,1021,68,124],[34,124]], PushBox.JUMP, [[-11,-106,24,16],[-26,-90,40,42],[-26,-31,40,32]]]],
      ["jump-roll-2", [[[561,862,59,97],[29,97]], PushBox.JUMP, [[17,-90,24,16],[-14,-91,40,42],[-22,-66,38,18]]]],
      ["jump-roll-3", [[[620,1028,94,99],[47,99]], PushBox.JUMP, [[22,-51,24,16],[-14,-81,40,42],[-22,-66,38,18]]]],
      ["jump-roll-4", [[[483,1016,114,94],[57,91]], PushBox.JUMP, [[-39,-46,24,16],[-30,-88,40,42],[-34,-118,44,48]]]],
      ["jump-roll-5", [[[395,1009,70,105],[35,105]], PushBox.JUMP, [[-72,-56,24,16],[-54,-77,52,40],[-14,-82,48,34]]]],
      ["jump-roll-6", [[[240,1016,144,86],[72,86]], PushBox.JUMP, [[-55,-100,24,16],[-48,-87,44,38],[-22,-66,38,18]]]],
      ["jump-roll-7", [[[732,1061,73,80],[36,80]], PushBox.JUMP, [[-11,-106,24,16],[-26,-90,40,42],[-26,-31,40,32]]]],

      // Jump first/last frame
      ['jump-land', [[[574,701,68,102],[34,102]], PushBox.IDLE, HurtBox.IDLE]],

      //crouch 
      ['crouch-1',[[[25,879,63,97],[31,97]], PushBox.IDLE, HurtBox.IDLE]],
      ['crouch-2',[[[108,891,58,85],[29,85]], PushBox.BEND, HurtBox.BEND]],
      ['crouch-3',[[[187,908,56,68],[28,68]], PushBox.CROUCH, HurtBox.CROUCH]],

      // Stand Turn
      ['idle-turn-1', [[[30,1184,73,102],[36,102]], PushBox.IDLE, [[-10,-89,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],
      ['idle-turn-2', [[[126,1184,75,102],[37,102]], PushBox.IDLE, [[-16,-96,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],
      ['idle-turn-3', [[[228,1184,71,102],[35,102]], PushBox.IDLE, [[-16,-96,28,18],[-14,-74,40,42],[-14,-31,40,32]]]],

      // Crouch Turn
      ['crouch-turn-1', [[[381,1217,59,69],[30,69]], PushBox.CROUCH, [[-7,-60,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],
      ['crouch-turn-2', [[[473,1217,61,69],[29,69]], PushBox.CROUCH, [[-7,-60,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],
      ['crouch-turn-3', [[[563,1214,59,69],[29,69]], PushBox.CROUCH, [[-26,-61,24,18],[-28,-46,44,24],[-28,-24,44,24]]]],

      // Light Punch
      ['light-punch-1', [[[23,1528,86,101],[43,100]], PushBox.IDLE, HurtBox.IDLE]],
      ['light-punch-2', [[[125,1527,113,102],[56,102]], PushBox.IDLE, HurtBox.IDLE, [11,-85,50,18]]],

      // Medium punch 
      ['med-punch-1', [[[26,1396,69,100],[34,100]], PushBox.IDLE, HurtBox.IDLE]],
      ['med-punch-2', [[[349,2501,86,101],[43,101]], PushBox.IDLE, HurtBox.PUNCH]],
      ['med-punch-3', [[[120,1397,117,99],[58,99]], PushBox.IDLE, HurtBox.PUNCH, [17,-85,68,14]]],
      
      // Heavy Punch
      ['heavy-punch-1', [[[120,1397,117,99],[58,99]], PushBox.IDLE, HurtBox.PUNCH, [17,-85,76,14]]],
      
      //Light Kick
      ['light-kick-1', [[[24,2702,76,100],[38,100]], PushBox.IDLE, [[-33,-96,30,18],[-41,-79,42,38],[-32,-52,44,50]]]],
      ['light-kick-2', [[[110,2703,116,99],[58,99]], PushBox.IDLE, [[-65,-96,30,18],[-57,-79,42,38],[-32,-52,44,50]], [-17,-98,66,28]]],

      // Medium Kick
      ['med-kick-1', [[[309,3119,120,102],[60,102]], PushBox.IDLE, [[-65,-96,30,18],[-57,-79,42,38],[-32,-52,44,50]],[-18,-98,80,28]]],

      // Heavy Kick
      ['heavy-kick-1', [[[25,3416,73,94],[36,94]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
      ['heavy-kick-2', [[[109,3400,69,110],[34,110]], PushBox.IDLE, [[12,-90,34,34],[-25,-78,42,42],[-11,-50,42,50]],[15,-99,40,32]]],
      ['heavy-kick-3', [[[321,3404,145,106],[72,106]], PushBox.IDLE, [[13,-91,62,34],[-25,-78,42,42],[-11,-50,42,50]],[21,-97,62,24]]],
      ['heavy-kick-4', [[[634,3408,99,102],[49,102]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
      ['heavy-kick-5', [[[745,3412,76,98],[38,98]], PushBox.IDLE, [[-41,-78,20,20],[-25,-78,42,42],[-11,-50,42,50]]]],
    
      // Hit Face
      ['hit-face-1', [[[124,6520,85,98],[42,98]], PushBox.IDLE, [[-25,-89,20,20],[-33,-74,40,46],[-30,-37,40,38]]]],
      ['hit-face-2', [[[229,6522,95,96],[47,96]], PushBox.IDLE, [[-42,-88,20,20],[-46,-74,40,46],[-33,-37,40,38]]]],
      ['hit-face-3', [[[341,6519,97,99],[48,99]], PushBox.IDLE, [[-52,-87,20,20],[-53,-71,40,46],[-33,-37,40,38]]]],
      ['hit-face-4', [[[465,6517,75,101],[37,101]], PushBox.IDLE, [[-57,-88,20,20],[-53,-71,40,46],[-33,-37,40,38]]]],

      // Hit Stomach
      ['hit-stomach-1', [[[128,6376,73,96],[36,96]], PushBox.IDLE, [[-15,-85,28,18],[-31,-69,42,42],[-30,-34,42,34]]]],
      ['hit-stomach-2', [[[220,6377,79,95],[39,95]], PushBox.IDLE, [[-17,82,28,18],[-33,-65,38,36],[-34,-34,42,34]]]],
      ['hit-stomach-3', [[[317,6374,84,98],[42,98]], PushBox.IDLE, [[-17,82,28,18],[-41,-59,38,30],[-34,-34,42,34]]]],
      ['hit-stomach-4', [[[430,6374,74,98],[34,98]], PushBox.IDLE, [[-28,-67,28,18],[-41,-59,38,30],[-40,-34,42,34]]]],
      
      // Stunned
      ['stun-1', [[[24,6927,81,99],[40,99]], PushBox.IDLE, [[8,-87,28,18],[-16,-75,40,46],[-26,-31,40,32]]]],
      ['stun-2', [[[130,6924,75,102],[37,102]], PushBox.IDLE, [[-9,-89,28,18],[-23,-75,40,46],[-26,-31,40,32]]]],
      ['stun-3', [[[226,6925,84,101],[42,101]], PushBox.IDLE, [[-22,-91,28,18],[-30,-72,42,40],[-26,-31,40,32]]]],

      // Hadouken
      ['special-1', [[[140,4574,100,95],[50,95]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-2', [[[266,4561,89,108],[44,108]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-3', [[[370,4571,111,98],[55,98]], PushBox.IDLE, HurtBox.IDLE]],
      ['special-4', [[[630,4571,107,98],[53,98]], PushBox.IDLE, [[38,-79,26,18],[21,-65,40,38],[-12,-30,78,30]]]],
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
