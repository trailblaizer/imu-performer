import { MidiMessage } from '../midi';
import { Note } from 'tonal';
import { range } from '../../api/imu';

export interface MidiTransformer {
  transform(notes: MidiMessage[]): MidiMessage[];
}

export class Transposer implements MidiTransformer {
  constructor(private semitones: number) {}
  transform(notes: MidiMessage[]): MidiMessage[] {
    return notes.map(
      (note) => [note[0], note[1] + this.semitones, note[2]] as MidiMessage
    );
  }
}

export class Interval implements MidiTransformer {
  constructor(private interval: number) {}
  transform(notes: MidiMessage[]): MidiMessage[] {
    return notes.map((note) => {
      const fullNote = Note.fromMidi(note[1]),
        currentIndex = range.indexOf(fullNote),
        newNote = Note.get(
          range[(currentIndex + (this.interval - 1)) % range.length] || ''
        ),
        midi = newNote.midi || 0 + 12;

      return [note[0], midi, note[2]] as MidiMessage;
    });
  }
}

export class Chordifier implements MidiTransformer {
  transform(notes: MidiMessage[]): MidiMessage[] {
    return notes
      .map((note) => {
        return [
          [note[0], note[1], note[2]] as MidiMessage,
          [note[0], note[1] + 4, note[2]] as MidiMessage,
          [note[0], note[1] + 7, note[2]] as MidiMessage,
        ];
      })
      .reduce((curr, agg) => agg.concat(...curr), [] as MidiMessage[]);
  }
}

export class Arpegiator implements MidiTransformer {
  transform(notes: MidiMessage[]): MidiMessage[] {
    notes.map((note) => {
      const _note = Note.fromMidi(note[1]);
      const notes = [
        _note,
        range[range.indexOf(_note) + 5],
        range[range.indexOf(_note) + 7],
      ];
      // _note.
      return notes;
    });

    return notes;
  }
}
