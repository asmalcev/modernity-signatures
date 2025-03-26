import fs from 'fs';
import path from 'path';

import babelParser from '@babel/parser';
import { describe, expect, test } from 'vitest';

import { createGetTypeScriptType } from './ts-experiments/manual';
import { scan } from './scan';

const getBabelAST = (sourceCodeFileName) =>
    babelParser.parse(
        fs.readFileSync(sourceCodeFileName, {
            encoding: 'utf-8',
        }),
        {
            sourceType: 'module',
            plugins: ['typescript'],
        }
    );

describe('[manual] getTypeScriptType tests', () => {
    test(`Variable with number`, () => {
        const sourceCodeFileName = path.join(
            __dirname,
            '../sandbox/number_toFixed.ts'
        );

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        const report = scan(babelAST.program.body, getTypeScriptType);

        const foundFeatures = Object.keys(report);

        expect(foundFeatures).to.contain('ConstVariableDeclaration');
        expect(foundFeatures).to.contain('NumberToFixed');
    });
});
