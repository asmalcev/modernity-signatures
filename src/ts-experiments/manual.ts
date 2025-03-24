import babelParser from '@babel/parser';
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import { exit } from 'node:process';

const sourceCodeFileName = path.join(__dirname, 'source.ts');

const sourceCode = fs.readFileSync(sourceCodeFileName, {
    encoding: 'utf-8',
});

const babelAST = babelParser.parse(sourceCode, {
    sourceType: 'module',
    plugins: ['typescript'],
}) as any;

const babelNode = babelAST.program.body[1].expression.callee.object;

// console.log(babelNode);

const program = ts.createProgram([sourceCodeFileName], {
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
});

const typeChecker = program.getTypeChecker();

const findMatchingTSNode = (_tsNode: ts.Node): ts.Node | undefined => {
    if (
        _tsNode.getStart() === babelNode.start &&
        _tsNode.getEnd() === babelNode.end
    ) {
        return _tsNode;
    }

    return ts.forEachChild(_tsNode, (child) => findMatchingTSNode(child));
};

const tsSourceFile = program.getSourceFile(sourceCodeFileName);

if (!tsSourceFile) {
    console.error('No source file found');
    exit(1);
}

const tsNode = findMatchingTSNode(tsSourceFile);

if (!tsNode) {
    console.error('No tsNode found');
    exit(1);
}

const symbol = typeChecker.getSymbolAtLocation(tsNode);

if (!symbol) {
    console.error('No symbol found');
    exit(1);
}

// console.log(symbol);

const symbolType = typeChecker.getTypeOfSymbolAtLocation(symbol, tsNode);

const flags = symbolType.getFlags();

if (flags & ts.TypeFlags.Any) {
    console.log('any');
} else if (flags & ts.TypeFlags.BigInt) {
    console.log('bigint');
} else if (flags & ts.TypeFlags.Object) {
    console.log('object ->', symbolType.symbol.name);
} else if (flags & ts.TypeFlags.Number) {
    console.log('number');
} else if (flags & ts.TypeFlags.String) {
    console.log('string');
} else if (flags & ts.TypeFlags.Undefined) {
    console.log('undefined');
} else if (flags & ts.TypeFlags.Void) {
    console.log('void');
} else if (flags & ts.TypeFlags.Null) {
    console.log('null');
} else if (flags & ts.TypeFlags.Boolean) {
    console.log('boolean');
} else if (flags & ts.TypeFlags.Never) {
    console.log('never');
} else if (flags & ts.TypeFlags.Unknown) {
    console.log('unknown');
} else if (flags & ts.TypeFlags.TemplateLiteral) {
    console.log('template literal');
} else if (flags & ts.TypeFlags.Enum) {
    console.log('enum');
} else if (flags & ts.TypeFlags.Union) {
    console.log('union');
} else if (flags & ts.TypeFlags.Intersection) {
    console.log('intersection');
} else if (flags & ts.TypeFlags.NumberLiteral) {
    console.log('number literal');
} else if (flags & ts.TypeFlags.StringLiteral) {
    console.log('string literal');
} else if (flags & ts.TypeFlags.BooleanLiteral) {
    console.log('boolean literal');
} else if (flags & ts.TypeFlags.BigIntLiteral) {
    console.log('big int literal');
}
