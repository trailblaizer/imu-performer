export function processArgs() {
  const args = require('args-parser')(process.argv);

  if (!args['port']) {
    throw 'Please specify port on which to run on!';
  }

  if (!args['midi-router-config']) {
    throw 'Please provide midi router configuration.';
  }

  return args;
}
