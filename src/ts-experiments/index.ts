import fs from 'fs';

import babelParser from '@babel/parser';
import { createGetTypeScriptType } from './manual';

const sourceCodeFileName = `src/ts-experiments/tests/sample.ts`;

const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

const babelAST = babelParser.parse(
    fs.readFileSync(sourceCodeFileName, {
        encoding: 'utf-8',
    }),
    {
        sourceType: 'module',
        plugins: ['typescript'],
    }
) as any;

const variableDeclarationY = babelAST.program.body[0].declarations[0];
console.log(getTypeScriptType(variableDeclarationY));
