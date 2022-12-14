import { MidiMessage } from '../midi';
import {
  createNote,
  getMidiNote,
  isNotesEqual,
  MyNote,
  MyNoteDuration,
} from '../note';
import { addToTime, Time } from '../time';
import { transport } from '../transport';
import { MidiTransformer } from './transformers';
import { MidiPort } from '../midi';
import { Note, NoNote } from '@tonaljs/core';
import { Note as TNote } from 'tonal';

const fetch = require('node-fetch');

export class VirtualPerformer {
  transformers: MidiTransformer[];
  boundedTo: Partial<MidiPort>[];
  prevNotePlayed?: MyNote;
  prevNotePlayed2?: Note | NoNote;
  sameNoteCheckEnabled: boolean;
  noteOffQueue: number[];

  constructor() {
    this.transformers = [];
    this.boundedTo = [];
    this.sameNoteCheckEnabled = true;
    this.noteOffQueue = [];

    const performNoteOff = ((queue: number[]) => {
      const _do = (queue: number[]) => {
        if (!queue.length) return;

        const note = queue.shift();

        setTimeout(() => this.sendMidiMessage([0x80, note || 60, 0]), 100);

        _do(queue);
      };

      return () => _do(queue);
    })(this.noteOffQueue);

    transport.register({
      nextTick() {
        performNoteOff();
      },
    });
  }

  off() {
    this.sendMidiMessage([123, 0, 0]);
  }

  addTransformer(transformer: MidiTransformer) {
    this.transformers.push(transformer);
  }

  bindTo(port: Partial<MidiPort>) {
    this.boundedTo.push(port);

    return this;
  }

  pipe(transformer: MidiTransformer) {
    this.transformers.push(transformer);

    return this;
  }

  sendMidiMessage(message: MidiMessage, bypassTransformers = false) {
    let msgs = [message];

    if (!bypassTransformers) {
      this.transformers.forEach((transformer) => {
        msgs = transformer.transform(msgs);
      });
    }

    // console.log('Sending Midi Messages', msgs);

    this.boundedTo.forEach((port) => {
      fetch('http://localhost:14001/perform', {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/JSON',
        },
        body: JSON.stringify({
          items: [
            {
              portId: port.id,
              messages: msgs,
            },
          ],
        }),
      });
    });
  }

  play(note: string, duration: MyNoteDuration, time: Time): void;
  play(note: MyNote, duration: MyNoteDuration, time: Time): void;
  play(note: string | MyNote, duration: MyNoteDuration, time: Time) {
    let _note: MyNote;

    if (typeof note === 'string') {
      _note = createNote(note);
    } else {
      _note = note;
    }

    transport.schedule(time, () => {
      const noteOnMessage = [0x90, getMidiNote(_note), 90];

      // Do something.
    });

    transport.schedule(
      addToTime(time, duration, transport.getTimeSignature()),
      () => {
        const noteOffMessage = [0x80, getMidiNote(_note), 0];

        // Do something.
      }
    );
  }

  playImmediately(note: string): () => void;
  playImmediately(note: MyNote): () => void;
  playImmediately(note: string | MyNote) {
    let _note: MyNote;

    if (typeof note === 'string') {
      _note = createNote(note);
    } else {
      _note = note;
    }

    if (
      !this.sameNoteCheckEnabled ||
      !isNotesEqual(this.prevNotePlayed, _note)
    ) {
      if (this.prevNotePlayed) {
        const _note = this.prevNotePlayed;
        transport.scheduleImmediately(() => {
          const noteOffMessage = [0x80, getMidiNote(_note), 0] as MidiMessage;

          this.sendMidiMessage(noteOffMessage);
        });
      }

      transport.scheduleImmediately(() => {
        const noteOnMessage = [0x90, getMidiNote(_note), 90] as MidiMessage;

        this.sendMidiMessage(noteOnMessage);
        this.prevNotePlayed = _note;
      });
    } else {
      console.log('No difference, doing nothing');
    }

    // const newTime = addToTime2(transport.getElapsedTime(), 2, 'measures');

    return () => {
      transport.scheduleImmediately(() => {
        const noteOffMessage = [0x80, getMidiNote(_note), 0] as MidiMessage;

        this.sendMidiMessage(noteOffMessage);
      });
    };
  }

  playImmediately2(note: Note | NoNote) {
    if (note.midi !== this.prevNotePlayed2?.midi) {
      if (this.prevNotePlayed2) {
        // ((prevNote: Note | NoNote) =>
        //   transport.scheduleImmediately(() =>
        //     setTimeout(
        //       () => this.sendMidiMessage([0x80, prevNote.midi || 60, 0]),
        //       100
        //     )
        //   ))(this.prevNotePlayed2);
        this.noteOffQueue.push(this.prevNotePlayed2.midi || 60);
      }

      transport.scheduleImmediately(() => {
        if (note.midi) this.sendMidiMessage([0x90, note.midi, 90]);
      });
      this.prevNotePlayed2 = note;
    }
  }

  nextTick(): void {
    throw new Error('Method not implemented.');
  }
}

export class SustainPerformer extends VirtualPerformer {
  constructor() {
    super();

    this.sameNoteCheckEnabled = false;
  }

  play(note: string, duration: MyNoteDuration, time: Time): void;
  play(note: MyNote, duration: MyNoteDuration, time: Time): void;
  play(_: string | MyNote, duration: MyNoteDuration, time: Time) {
    const note = createNote('C4');

    return super.play(note, duration, time);
  }

  playImmediately(note: string): () => void;
  playImmediately(note: MyNote): () => void;
  playImmediately(_: string | MyNote) {
    const note = createNote('C4');

    return super.playImmediately(note);
  }

  playImmediately2(_: Note | NoNote) {
    return super.playImmediately2(TNote.get('C4'));
  }
}
