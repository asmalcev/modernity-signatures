import babel from '@babel/parser';
import fs from 'node:fs';

import { scan } from './scan';
import { getBrowserSupport } from './getBrowserSupport';

const data = fs.readFileSync('sandbox/test1.js', {
    encoding: 'utf-8',
});

const parsed = babel.parse(data, {
    sourceType: 'module',
});

// console.log(JSON.stringify(parsed))

const report = scan(parsed.program.body);

const browserSupport = {};

for (const key in report) {
    browserSupport[key] = getBrowserSupport(key);
}

console.info(browserSupport);

// import bcd from '@mdn/browser-compat-data';

// console.log(JSON.stringify(bcd.javascript.statements.const));
