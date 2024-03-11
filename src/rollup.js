import { parseAst } from 'rollup/parseAst';
import fs from 'node:fs';

const data = fs.readFileSync('sandbox/sample1.js', {
    encoding: 'utf-8',
});

const parsed = parseAst(data);

console.log(parsed);
