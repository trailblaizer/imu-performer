import { Express, Request, Response } from 'express';
import { transport } from '../midi/transport';

function startTransport(_: Request, res: Response) {
  transport.start();

  res.send({ status: transport.getStatus() });
}

function stopTransport(_: Request, res: Response) {
  transport.stop();

  res.send({ status: transport.getStatus() });
}

function getElapsedTime(_: Request, res: Response) {
  res.send(transport.getElapsedTime());
}

function getStatus(_: Request, res: Response) {
  res.send({ status: transport.getStatus() });
}

function setTempo(req: Request, res: Response) {
  const tempoString = req.body.tempo;

  if (!tempoString) {
    res.status(400).send('Please provide valid tempo value in payload.');
  }

  const tempo = +tempoString;

  transport.setTempo(tempo);

  res.send(transport.get());
}

function perform(req: Request, res: Response) {}

function setTimeSignature(req: Request, res: Response) {
  if (!req.body.timeSignature) {
    res
      .status(400)
      .send('Please provide valid time signature value in payload.');
  }

  const ts = req.body.timeSignature.split('/');
  const timeSignature = [+ts[0], +ts[1]] as [number, number];

  transport.setTimeSignature(timeSignature);

  res.send(transport.get());
}

export function register(app: Express) {
  app.post('/transport/start', startTransport);
  app.post('/transport/stop', stopTransport);
  app.put('/transport/tempo', setTempo);
  app.put('/transport/time-signature', setTimeSignature);
  app.get('/transport/elapsed', getElapsedTime);
  app.get('/transport/status', getStatus);
  app.get('/transport', (_, res) => res.send(transport.get()));
}
