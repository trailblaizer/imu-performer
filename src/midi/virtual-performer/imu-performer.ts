// import { note } from '@tonaljs/core';
import { Note } from 'tonal';
import { range } from '../../api/imu';
import { VirtualPerformer } from './performer';

// export function convertLevelToNote(level: number) {
//   let note: string;

//   switch (level) {
//     case 1:
//       note = 'C4';
//       break;

//     case 2:
//       note = 'D4';
//       break;

//     case 3:
//       note = 'E4';
//       break;

//     case 4:
//       note = 'F4';
//       break;

//     case 5:
//       note = 'G4';
//       break;

//     case 6:
//       note = 'A4';
//       break;

//     case 7:
//       note = 'B4';
//       break;

//     default:
//       note = 'B4';
//       break;
//   }

//   return note;
// }

export class IMUPerformer {
  boundedTo: VirtualPerformer[];
  currentLevel: number;
  previousRoll: number;
  currentRoll: number;

  constructor() {
    this.boundedTo = [];
    this.currentLevel = 0;
    this.previousRoll = 0;
    this.currentRoll = 0;
  }

  setCurrentNote(position: number) {
    this.currentLevel = position;
  }

  getCurrentNote() {
    return this.currentLevel;
  }

  setCurrentRoll(roll: number) {
    this.previousRoll = this.currentRoll;
    this.currentRoll = roll;

    if (this.previousRoll != this.currentRoll) {
      this.boundedTo.forEach((performer) => {
        performer.sendMidiMessage([176, 1, this.currentRoll], true);
        performer.sendMidiMessage([176, 11, this.currentRoll], true);
      });
    }
  }

  getCurrentRoll() {
    return this.currentRoll;
  }

  bindTo(player: VirtualPerformer) {
    this.boundedTo.push(player);

    return this;
  }

  perform(levelProcessor?: (level: number) => number) {
    let actualLevel = this.currentLevel + (range.length - 1) / 2;

    if (levelProcessor) {
      actualLevel = levelProcessor(actualLevel);
    }

    const _note = Note.get(range[actualLevel] || '');

    this.boundedTo.forEach((player) => player.playImmediately2(_note));
  }
}
