import babel from '@babel/parser';
import fs from 'node:fs';

import { scan } from './scan';

const data = fs.readFileSync('sandbox/try_catch.js', {
    encoding: 'utf-8',
});

const parsed = babel.parse(data, {
    sourceType: 'module',
});

const report = scan(parsed.program.body);

// console.info(report);

// import bcd from '@mdn/browser-compat-data';

// console.log(JSON.stringify(bcd.javascript.statements.const));
