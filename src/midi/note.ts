export enum MyNoteName {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
}

export enum MyAccidental {
  NATURAL = '',
  SHARP = '#',
  FLAT = 'b',
}

export interface MyNoteDuration {
  beats: number;
}

export interface MyNote {
  name: MyNoteName;
  register: number;
  accidental: MyAccidental;
}

export function isNotesEqual(note1?: MyNote, note2?: MyNote) {
  if (!note1 || !note2) return false;

  if (
    note1.accidental === note2.accidental &&
    note1.name === note2.name &&
    note1.register === note2.register
  ) {
    return true;
  }

  return false;
}

export function getMidiNote(note: MyNote) {
  return 9 + note.register * 12 + getValueForNoteName(note);
}

export function getValueForNoteName(note: MyNote): number {
  switch (note.name) {
    case MyNoteName.A:
      if (note.accidental === MyAccidental.SHARP) return 1;
      else if (note.accidental === MyAccidental.FLAT) return -1;
      else return 0;

    case MyNoteName.B:
      if (note.accidental === MyAccidental.SHARP) return 3;
      else if (note.accidental === MyAccidental.FLAT) return 1;
      else return 2;

    case MyNoteName.C:
      if (note.accidental === MyAccidental.SHARP) return 4;
      else if (note.accidental === MyAccidental.FLAT) return 2;
      else return 3;

    case MyNoteName.D:
      if (note.accidental === MyAccidental.SHARP) return 6;
      else if (note.accidental === MyAccidental.FLAT) return 4;
      else return 5;

    case MyNoteName.E:
      if (note.accidental === MyAccidental.SHARP) return 8;
      else if (note.accidental === MyAccidental.FLAT) return 6;
      else return 7;

    case MyNoteName.F:
      if (note.accidental === MyAccidental.SHARP) return 9;
      else if (note.accidental === MyAccidental.FLAT) return 7;
      else return 8;

    case MyNoteName.G:
      if (note.accidental === MyAccidental.SHARP) return 11;
      else if (note.accidental === MyAccidental.FLAT) return 9;
      else return 10;

    default:
      return 0;
  }
}

export function getNoteDuration(noteDurationValue: string) {
  return {
    beats: +noteDurationValue,
  } as MyNoteDuration;
}

export function getNoteFullName(note: MyNote) {
  return `${note.name}${
    note.accidental === MyAccidental.SHARP
      ? '#'
      : note.accidental === MyAccidental.FLAT
      ? 'b'
      : ''
  }${note.register}`;
}

export function getNote(noteValue: string) {
  switch (noteValue.toUpperCase()) {
    case 'A':
      return MyNoteName.A;
    case 'B':
      return MyNoteName.B;
    case 'C':
      return MyNoteName.C;
    case 'D':
      return MyNoteName.D;
    case 'E':
      return MyNoteName.E;
    case 'F':
      return MyNoteName.F;
    case 'G':
      return MyNoteName.G;
    default:
      throw `Invalid note value ${noteValue}`;
  }
}

export function getNextNoteHalfStep(note: MyNote) {
  switch (note.name) {
    case 'C':
      if (note.accidental == MyAccidental.SHARP)
        return createNote(`D${note.register}`);
      else if (note.accidental == MyAccidental.FLAT)
        return createNote(`C${note.register}`);
      else return createNote(`C#${note.register}`);

    case 'D':
      if (note.accidental == MyAccidental.SHARP)
        return createNote(`E${note.register}`);
      else if (note.accidental == MyAccidental.FLAT)
        return createNote(`D${note.register}`);
      else return createNote(`D#${note.register}`);

    case 'E':
      if (note.accidental == MyAccidental.SHARP)
        return createNote(`F#${note.register}`);
      else if (note.accidental == MyAccidental.FLAT)
        return createNote(`E${note.register}`);
      else return createNote(`F${note.register}`);

    case 'F':
      if (note.accidental == MyAccidental.SHARP)
        return createNote(`G${note.register}`);
      else if (note.accidental == MyAccidental.FLAT)
        return createNote(`F${note.register}`);
      else return createNote(`F#${note.register}`);

    case 'G':
      if (note.accidental == MyAccidental.SHARP)
        return createNote(`A${note.register}`);
      else if (note.accidental == MyAccidental.FLAT)
        return createNote(`G${note.register}`);
      else return createNote(`G#${note.register}`);

    case 'A':
      if (note.accidental == MyAccidental.SHARP)
        return createNote(`B${note.register}`);
      else if (note.accidental == MyAccidental.FLAT)
        return createNote(`A${note.register}`);
      else return createNote(`A#${note.register}`);

    case 'B':
      if (note.accidental == MyAccidental.SHARP)
        return createNote(`C#${note.register}`);
      else if (note.accidental == MyAccidental.FLAT)
        return createNote(`B${note.register}`);
      else return createNote(`C${note.register}`);

    default:
      if (note.accidental == MyAccidental.SHARP)
        return createNote(`C#${note.register}`);
      else if (note.accidental == MyAccidental.FLAT)
        return createNote(`B${note.register}`);
      else return createNote(`C${note.register}`);
  }
}

export function getNextNoteForInterval(note: MyNote, interval: number) {
  return createNote(
    `${String.fromCharCode(note.name.charCodeAt(0) + interval)}${
      note.accidental
    }${note.register}`
  );
}

export function addHalfSteps(note: MyNote, halfSteps: number) {
  let newNote = getNextNoteHalfStep(note);
  new Array(halfSteps - 1).fill(-1).forEach((_) => {
    console.log('Getting next note of', newNote);
    newNote = getNextNoteHalfStep(newNote);
    console.log('Next Note = ', newNote);
  });

  return newNote;
}

export function printNote(note: MyNote) {
  return `${note.name}${
    note.accidental === MyAccidental.FLAT
      ? 'b'
      : note.accidental === MyAccidental.SHARP
      ? '#'
      : ''
  }${note.register}`;
}

export function createNote(note: string): MyNote {
  const registerString = note.substring(note.length - 1);

  if (!registerString) throw 'Please provide note register in note value.';

  const register = +registerString;

  const noteValue = note.substring(0, note.length - 1);
  const noteName = note.substring(0, 1);

  if (noteValue.length > 1) {
    const accidentalValue = noteValue.substring(noteValue.length - 1);
    const accidental =
      accidentalValue === '#' ? MyAccidental.SHARP : MyAccidental.FLAT;

    return {
      name: getNote(noteName),
      register,
      accidental,
    };
  } else {
    const accidental = MyAccidental.NATURAL;

    return {
      name: getNote(noteName),
      register,
      accidental,
    };
  }
}
