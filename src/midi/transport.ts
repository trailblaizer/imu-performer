import { Scale } from 'tonal';
import { addToTime, Time } from './time';

export interface Tickable {
  nextTick(): void;
}

export type Schedulable = () => void;

class Transport {
  private timeSignature: [number, number];
  private tempo: number;
  private tickables: Tickable[];
  private status: 'started' | 'stopped';

  private scheduledSchedulables: {
    [measure: number]: {
      [beat: number]: [...schedulables: Schedulable[]];
    };
  };

  private transportInterval?: NodeJS.Timer;
  private currentTime: Time;

  constructor() {
    this.timeSignature = [4, 4]; // Default time signature;
    this.tempo = 720;
    this.tickables = [];
    this.status = 'stopped';
    this.currentTime = [1, 1];
    this.scheduledSchedulables = {};

    this.nextTick = this.nextTick.bind(this);
  }

  setTimeSignature([noOfBeats, smallestBeat]: [number, number]) {
    this.timeSignature = [noOfBeats, smallestBeat];
  }

  setTempo(tempo: number) {
    this.tempo = tempo;
  }

  private nextTick() {
    // console.log('Schedulables', this.scheduledSchedulables);
    this.tickables.forEach((tickable) => tickable.nextTick());
    if (
      this.scheduledSchedulables[this.currentTime[0]] &&
      this.scheduledSchedulables[this.currentTime[0]][this.currentTime[1]]
    ) {
      function runSchedulables(schedulables: Schedulable[]) {
        if (!schedulables.length) {
          return;
        }

        const schedulable = schedulables.shift();

        if (schedulable) {
          schedulable();
        }

        runSchedulables(schedulables);
      }

      runSchedulables(
        this.scheduledSchedulables[this.currentTime[0]][this.currentTime[1]]
      );
    }

    if (this.currentTime[1] === this.timeSignature[0]) {
      this.currentTime[1] = 1;
      this.currentTime[0]++;
    } else {
      this.currentTime[1]++;
    }
  }

  schedule(time: Time, schedulable: Schedulable) {
    this.scheduledSchedulables[time[0]] =
      this.scheduledSchedulables[time[0]] || {};
    this.scheduledSchedulables[time[0]][time[1]] =
      this.scheduledSchedulables[time[0]][time[1]] || [];
    this.scheduledSchedulables[time[0]][time[1]].push(schedulable);

    // console.log('Scheduled');
  }

  scheduleImmediately(schedulable: Schedulable) {
    this.schedule(
      addToTime(this.currentTime, { beats: 1 }, this.timeSignature),
      schedulable
    );
  }

  getElapsedTime() {
    return this.currentTime;
  }

  register(tickable: Tickable) {
    this.tickables.push(tickable);
  }

  start() {
    console.log('Transport Started');
    this.status = 'started';
    this.transportInterval = setInterval(
      this.nextTick,
      (60 * 1000) / this.tempo
    );
  }

  stop() {
    this.status = 'stopped';
    if (this.transportInterval) {
      clearInterval(this.transportInterval);
    }
  }

  getTimeSignature() {
    return this.timeSignature;
  }

  getStatus() {
    return this.status;
  }

  get() {
    return {
      status: this.getStatus(),
      timeSignature: `${this.timeSignature[0]}/${this.timeSignature[1]}`,
      tempo: `${this.tempo} BPM`,
      elapsedTime: this.currentTime,

      scheduled: Object.keys(this.scheduledSchedulables).reduce(
        (agg: any, measure: string) => {
          agg[measure] = Object.keys(
            this.scheduledSchedulables[+measure] || []
          ).reduce((_agg: any, beat: string) => {
            _agg[beat] = (this.scheduledSchedulables[+measure][+beat] || [])
              .map((_) => '.')
              .join('');

            return _agg;
          }, {});

          return agg;
        },
        {}
      ),
    };
  }
}

export const transport = new Transport();
