import { babel } from '@babel/parser';
import fs from 'node:fs';

const data = fs.readFileSync('sandbox/sample1.js', {
    encoding: 'utf-8',
});

const parsed = babel.parse(data, {
    sourceType: 'module',
});

console.log(parsed);
