import { Express, Request, Response } from 'express';
import { Scale } from 'tonal';
import { allVirtualPerformers } from '../performers';

export const range = Scale.rangeOf('c major')('c0', 'c8');

export const imuPerformerData = {
  left: {
    currentNote: 0,
    currentRoll: 0,
  },
  right: {
    currentNote: 0,
    currentRoll: 0,
  },
};

function updatePeformerData(req: Request, res: Response) {
  const { currentNote: leftCurrentNote, roll: leftCurrentRoll } = req.body.left;
  const { currentNote: rightCurrentNote, roll: rightCurrentRoll } =
    req.body.right;

  imuPerformerData.left = {
    currentNote: leftCurrentNote,
    currentRoll: leftCurrentRoll,
  };
  imuPerformerData.right = {
    currentNote: rightCurrentNote,
    currentRoll: rightCurrentRoll,
  };

  res.send('Success');
}

function getPerformerData(req: Request, res: Response) {
  res.send(imuPerformerData);
}

function sendOffToAll(req: Request, res: Response) {
  allVirtualPerformers.forEach((performer) => performer.off());

  res.send('Success');
}

export function register(app: Express) {
  app.put('/performer', updatePeformerData);
  app.get('/performer', getPerformerData);
  app.get('/off', sendOffToAll);
}
