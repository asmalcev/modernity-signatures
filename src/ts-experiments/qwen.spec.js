import babelParser from '@babel/parser';
import { describe, expect, test } from 'vitest';

import { createGetTypeScriptType } from './qwen';

describe('[qwen] getTypeScriptType tests', () => {
    test(`Two const declarations`, () => {
        const sourceCode = `const x: number = 42; const y = "hello"; const z = true;`;

        const getTypeScriptType = createGetTypeScriptType(sourceCode);

        const babelAST = babelParser.parse(sourceCode, {
            sourceType: 'module',
            plugins: ['typescript'],
        });

        expect(
            getTypeScriptType(babelAST.program.body[0].declarations[0])
        ).toBe('number');

        expect(
            getTypeScriptType(babelAST.program.body[1].declarations[0])
        ).toBe('string');

        expect(
            getTypeScriptType(babelAST.program.body[2].declarations[0])
        ).toBe('boolean');
    });
});
