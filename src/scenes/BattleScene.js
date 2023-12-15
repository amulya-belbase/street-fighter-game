import {
  FIGHTER_HURT_DELAY,
  FighterAttackBaseData,
  FighterAttackStrength,
  FighterId,
} from "../constants/fighter.js";
import { STAGE_MID_POINT, STAGE_PADDING } from "../constants/stage.js";
import { Camera } from "../engine/Camera.js";
import { Ryu, Ken, Sagat, Guile } from "../entities/fighters/index.js";
import { FpsCounter } from "../entities/overlays/FpsCounter.js";
import { StatusBar } from "../entities/overlays/StatusBar.js";
import { KenStage } from "../entities/stage/KenStage.js";
import { gameState } from "../state/gameState.js";
import {
  LightHitSplash,
  HeavyHitSplash,
  MediumHitSplash,
} from "../entities/fighters/shared/index.js";
import { FRAME_TIME } from "../constants/game.js";
import { EntityList } from "../engine/EntityList.js";

export class BattleScene {
  fighters = [];
  camera = undefined;
  fighterDrawOrder = [0, 1];
  hurtTimer = undefined;

  constructor() {
    this.stage = new KenStage();
    this.entities = new EntityList();
    this.startRound();
    this.overlays = [new StatusBar(this.fighters), new FpsCounter()];
  }

  getFighterEntityClass(id) {
    // console.log(id);
        switch(id) {
            case 'Ryu':
                return Ryu;
            case 'Ken':
                return Ken;
            case 'Sagat':
                return Sagat; // Assuming there's a Honda class
            case 'Guile':
                return Guile;
            default:
                throw new Error('Unimplemented fighter entity request!');
        }
  }

  getFighterEntity(fighterState, index) {
    // console.log(fighterState, index);
    const FighterEntityClass = this.getFighterEntityClass(fighterState.id);
    return new FighterEntityClass(
      index,
      this.handleAttackHit.bind(this),
      this.entities
    );
  }

  getFighterEntities() {
    const fighterEntities = gameState.fighters.map(
      this.getFighterEntity.bind(this)
    );
    fighterEntities[0].opponent = fighterEntities[1];
    fighterEntities[1].opponent = fighterEntities[0];
    return fighterEntities;
  }

  getHitSplashClass(strength) {
    switch (strength) {
      case FighterAttackStrength.LIGHT:
        return LightHitSplash;
      case FighterAttackStrength.MEDIUM:
        return MediumHitSplash;
      case FighterAttackStrength.HEAVY:
        return HeavyHitSplash;
      default:
        throw new Error("Unknown strength requested");
    }
  }

  handleAttackHit(time, playerId, opponentId, position, strength) {
    gameState.fighters[playerId].score += FighterAttackBaseData[strength].score;
    gameState.fighters[opponentId].hitPoints -=
      FighterAttackBaseData[strength].damage;

    this.hurtTimer = time.previous + 20 * FRAME_TIME;
    this.fighterDrawOrder = [playerId, opponentId];
    if (!position) return;
    this.entities.add(
      this.getHitSplashClass(strength),
      time,
      position.x,
      position.y,
      playerId
    );
  }

  startRound() {
    this.fighters = this.getFighterEntities();
    this.camera = new Camera(
      STAGE_MID_POINT + STAGE_PADDING - 192,
      16,
      this.fighters
    );
  }

  updateFighters(time, context) {
    for (const fighter of this.fighters) {
      if (time.previous < this.hurtTimer) {
        fighter.updateHurtShake(time, this.hurtTimer);
      } else {
        fighter.update(time, context, this.camera);
      }
    }
  }

  updateOverlays(time, context) {
    for (const overlay of this.overlays) {
      overlay.update(time, context, this.camera);
    }
  }

  update(time, context) {
    this.updateFighters(time, context);
    this.stage.update(time);
    this.entities.update(time, context, this.camera);
    // this.updateEntities(time,context);
    this.camera.update(time, context);
    this.updateOverlays(time, context);
  }

  drawFighters(context) {
    for (const FighterId of this.fighterDrawOrder) {
      this.fighters[FighterId].draw(context, this.camera);
    }
  }

  drawOverlays(context) {
    for (const overlay of this.overlays) {
      overlay.draw(context, this.camera);
    }
  }
  draw(context) {
    this.stage.drawBackground(context, this.camera);
    this.drawFighters(context);
    this.entities.draw(context, this.camera);
    // this.drawEntities(context);
    this.stage.drawForeground(context, this.camera);
    this.drawOverlays(context);
  }
}
