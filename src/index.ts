import babel from '@babel/parser';
import fs from 'node:fs';

import { scan } from './scan';
// import { getBrowserSupport } from './getBrowserSupport';

import { createGetTypeScriptType } from './ts-experiments/manual';
import { createTsSourcesFromFile } from './ts-experiments/createTsSourcesFromFile';

const sourceCodeFileName = 'sandbox/number_toFixed.ts';

const data = fs.readFileSync(sourceCodeFileName, {
    encoding: 'utf-8',
});

const parsed = babel.parse(data, {
    sourceType: 'module',
    plugins: ['typescript'],
});

// console.log(JSON.stringify(parsed))

const { tsSourceFile, typeChecker } =
    createTsSourcesFromFile(sourceCodeFileName);

const getTypeScriptType = createGetTypeScriptType(tsSourceFile, typeChecker);

const report = scan(parsed.program.body, getTypeScriptType);

console.log(report);

// const browserSupport = {};

// for (const key in report) {
//     browserSupport[key] = getBrowserSupport(key);
// }

// console.info(browserSupport);

// import bcd from '@mdn/browser-compat-data';

// console.log(JSON.stringify(bcd.javascript.statements.const));
