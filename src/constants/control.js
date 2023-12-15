export const Control = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
  LIGHT_PUNCH: 'lightPunch',
  MEDIUM_PUNCH: 'mediumPunch',
  HEAVY_PUNCH: 'heavyPunch',
  LIGHT_KICK: 'lightKick',
  MEDIUM_KICK: 'mediumKick',
  HEAVY_KICK: 'heavyKick',
  SPECIAL_1: 'special1',
};

export const controls = [
  {
    keyboard: {
      [Control.LEFT]: "ArrowLeft",
      [Control.RIGHT]: "ArrowRight",
      [Control.UP]: "ArrowUp",
      [Control.DOWN]: "ArrowDown",
      [Control.LIGHT_PUNCH]:"ControlRight",
      [Control.MEDIUM_PUNCH]:"AltRight",
      [Control.HEAVY_PUNCH]:"Space",
      [Control.LIGHT_KICK]:"Slash",
      [Control.MEDIUM_KICK]:"Period",
      [Control.HEAVY_KICK]:"Comma",
      [Control.SPECIAL_1]:"Enter",     // key config for hadouken
    },
  },
  {
    keyboard: {
      [Control.LEFT]: "KeyA",
      [Control.RIGHT]: "KeyD",
      [Control.UP]: "KeyW",
      [Control.DOWN]: "KeyS",
      [Control.LIGHT_PUNCH]:"KeyQ",
      [Control.MEDIUM_PUNCH]:"KeyE",
      [Control.HEAVY_PUNCH]:"KeyR",
      [Control.LIGHT_KICK]:"KeyZ",
      [Control.MEDIUM_KICK]:"KeyX",
      [Control.HEAVY_KICK]:"KeyC",
      [Control.SPECIAL_1]:"Tab",
    },
  },
];
