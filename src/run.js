import appConfig from '../examples/pet-food-cajs.js';
import { parseCAJS } from './parse.js';
import repl from 'repl';

const replServer = repl.start();
replServer.context.parsed = parseCAJS(appConfig);