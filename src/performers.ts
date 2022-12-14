import { MidiPort, MidiRouterConfig } from './midi/midi';
import { IMUPerformer } from './midi/virtual-performer/imu-performer';
import {
  SustainPerformer,
  VirtualPerformer,
} from './midi/virtual-performer/performer';
import {
  Arpegiator,
  Interval,
  Transposer,
} from './midi/virtual-performer/transformers';

export const leftHandPerformer = new IMUPerformer();
export const rightHandPerformer = new IMUPerformer();

export const allVirtualPerformers: VirtualPerformer[] = [];

export function setupPerformers(config: MidiRouterConfig) {
  function getPort(id: string): MidiPort {
    return (
      config.virtualPorts.find((port) => port.id === id) || {
        id: 'not-found',
        name: 'Not Found',
      }
    );
  }

  console.log('Binding');

  const bassPerformer = new VirtualPerformer()
    .pipe(new Transposer(-12))
    .pipe(new Interval(1))
    .bindTo(getPort('vplayer-1'));

  const celloPerformer = new VirtualPerformer()
    .pipe(new Transposer(-12))
    .pipe(new Interval(3))
    .bindTo(getPort('vplayer-2'));

  const violaPlayer = new VirtualPerformer()
    .pipe(new Interval(5))
    .pipe(new Transposer(-12))
    .bindTo(getPort('vplayer-3'));

  const rainPlayer = new SustainPerformer().bindTo(getPort('vplayer-4'));

  const clarinetPerformer = new VirtualPerformer()
    .bindTo(getPort('vplayer-5'))
    .pipe(new Interval(1));
  const flutePlayer = new VirtualPerformer()
    .pipe(new Interval(1))
    .bindTo(getPort('vplayer-6'));
  const violinPlayer = new VirtualPerformer()
    .pipe(new Transposer(-12))
    .pipe(new Interval(5))
    .bindTo(getPort('vplayer-7'));
  const pianoPlayer = new VirtualPerformer()
    .pipe(new Arpegiator())
    .bindTo(getPort('vplayer-8'));

  allVirtualPerformers.push(
    bassPerformer,
    celloPerformer,
    violaPlayer,
    rainPlayer,
    clarinetPerformer,
    flutePlayer,
    violinPlayer,
    pianoPlayer
  );

  leftHandPerformer
    .bindTo(bassPerformer)
    .bindTo(celloPerformer)
    .bindTo(violaPlayer)
    .bindTo(rainPlayer);

  rightHandPerformer
    .bindTo(clarinetPerformer)
    .bindTo(flutePlayer)
    .bindTo(violinPlayer);
  // .bindTo(violaPlayer);
  // .bindTo(pianoPlayer);
}
