import { MyNoteDuration } from './note';
import { transport } from './transport';

export type Time = [number, number];
export type TimeSignature = [number, number];

export function addToTime(
  from: Time,
  duration: MyNoteDuration,
  timeSignature: TimeSignature
) {
  let extraMeasures = Math.floor(duration.beats / timeSignature[0]);
  const extraBeats = duration.beats % timeSignature[0];

  if (from[1] + extraBeats > timeSignature[0]) {
    extraMeasures++;
  }

  return [
    from[0] + extraMeasures,
    (from[1] + extraBeats) % timeSignature[0],
  ] as Time;
}

export function addToTime2(
  time: Time,
  amount: number,
  what: 'measures' | 'beats'
): Time {
  const nBeats = transport.getTimeSignature()[1];

  if (what === 'measures') {
    return [time[0] + amount, time[1]];
  } else {
    const deltaMeasures = Math.floor((time[1] + amount) / nBeats);
    const deltaBeats = (time[1] + amount) % nBeats;

    return [time[0] + deltaMeasures, time[1] + deltaBeats];
  }
}
