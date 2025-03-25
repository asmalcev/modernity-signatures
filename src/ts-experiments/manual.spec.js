import fs from 'fs';
import path from 'path';

import babelParser from '@babel/parser';
import { describe, expect, test } from 'vitest';

import { createGetTypeScriptType } from './manual';

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
        const sourceCodeFileName = path.join(__dirname, 'tests/number.ts');

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        expect(getTypeScriptType(babelAST.program.body[1].expression)).toBe(
            'number'
        );
    });

    test(`Variable with string`, () => {
        const sourceCodeFileName = path.join(__dirname, 'tests/string.ts');

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        expect(getTypeScriptType(babelAST.program.body[1].expression)).toBe(
            'string'
        );
    });

    test(`Variable with boolean`, () => {
        const sourceCodeFileName = path.join(__dirname, 'tests/boolean.ts');

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        expect(getTypeScriptType(babelAST.program.body[1].expression)).toBe(
            'boolean'
        );
    });

    test(`Variable with array`, () => {
        const sourceCodeFileName = path.join(__dirname, 'tests/array-push.ts');

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        expect(
            getTypeScriptType(babelAST.program.body[1].expression.callee.object)
        ).toBe('Array');
    });

    test(`Object with number property`, () => {
        const sourceCodeFileName = path.join(
            __dirname,
            'tests/member-number.ts'
        );

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        expect(
            getTypeScriptType(babelAST.program.body[1].expression.property)
        ).toBe('number');
    });

    test(`Return of map`, () => {
        const sourceCodeFileName = path.join(
            __dirname,
            'tests/array-chain-easy.ts'
        );

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        expect(
            getTypeScriptType(babelAST.program.body[2].expression)
        ).toBe('Array');
    });

    test(`Array with chain of methods`, () => {
        const sourceCodeFileName = path.join(__dirname, 'tests/array-chain-hard.ts');

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        expect(
            getTypeScriptType(babelAST.program.body[1].expression.callee.object)
        ).toBe('Array');
    });

    test(`Hard chain of methods`, () => {
        const sourceCodeFileName = path.join(__dirname, 'tests/chain-hard.ts');

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        expect(getTypeScriptType(babelAST.program.body[1].expression)).toBe(
            'boolean'
        );

        expect(
            getTypeScriptType(babelAST.program.body[1].expression.callee.object)
        ).toBe('boolean');

        expect(
            getTypeScriptType(
                babelAST.program.body[1].expression.callee.object.callee.object
            )
        ).toBe('string');

        expect(
            getTypeScriptType(
                babelAST.program.body[1].expression.callee.object.callee.object
                    .callee.object
            )
        ).toBe('number');
    });
});
