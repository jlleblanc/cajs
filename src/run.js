import parsed from './parse.js';
import repl from 'repl';

console.log(parsed);

const replServer = repl.start();
replServer.context.parsed = parsed;