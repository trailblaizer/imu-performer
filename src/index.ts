import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import http from 'http';
import { processArgs } from './process-args';
import { registerApis } from './api/register';
import { transport } from './midi/transport';
import { MidiRouterConfig } from './midi/midi';
import { imuPerformerData } from './api/imu';
import {
  leftHandPerformer,
  rightHandPerformer,
  setupPerformers,
} from './performers';

const args = processArgs();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const server = http.createServer(app);
registerApis(app);

const config: MidiRouterConfig = require(args['midi-router-config']);
console.log('\n------------------------------');
console.log('. Welcome to IMU Performer.');
console.log(`. Current Time is ${new Date().toLocaleString()} .`);
console.log('------------------------------\n');

const port = +args['port'];

export function startServer(port: number) {
  server.listen(port, () => {
    console.log(`App Server Started on *:${port}`);
  });

  setupPerformers(config);

  transport.start();

  transport.register({
    nextTick() {
      leftHandPerformer.setCurrentNote(imuPerformerData.left.currentNote);
      rightHandPerformer.setCurrentNote(imuPerformerData.right.currentNote);

      leftHandPerformer.setCurrentRoll(imuPerformerData.left.currentRoll);
      rightHandPerformer.setCurrentRoll(imuPerformerData.right.currentRoll);

      leftHandPerformer.perform((level) => {
        const note = level % 7;
        const base = level - note;

        switch (note) {
          case 1:
          case 2:
          case 3:
          case 7:
            return base + 1;

          default:
            return level;
        }
      });
      rightHandPerformer.perform();
    },
  });
}

startServer(port);
