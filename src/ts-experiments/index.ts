import babelParser from '@babel/parser';
import { createGetTypeScriptType } from './qwen';

const sourceCode = `const y = "hello";`;

const getTypeScriptType = createGetTypeScriptType(sourceCode);

const babelAST = babelParser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['typescript'],
}) as any;

const variableDeclarationY = babelAST.program.body[0].declarations[0];
console.log(getTypeScriptType(variableDeclarationY));
