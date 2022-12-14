import { MyAccidental, MyNoteName } from './note';

export interface MidiDevice {
  name: string;
}

export interface MidiNote {
  note: MyNoteName;
  register: number;
  accidental: MyAccidental;
}

export type MidiMessage = [cc: number, data1: number, data2: number];

export interface MidiPort {
  id: string;
  name: string;
}

export interface MidiRouterConfig {
  virtualPorts: MidiPort[];
}
