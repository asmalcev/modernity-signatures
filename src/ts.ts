import * as ts from 'typescript';

const filePath = 'sandbox/array.ts';

let program = ts.createProgram([filePath], { allowJs: true });
const typechecker = program.getTypeChecker();

const sourceFile = program.getSourceFile(filePath);

if (sourceFile) {
    ts.forEachChild(sourceFile, (node) => {
        // console.info(JSON.stringify(node));
        typechecker.getSymbolAtLocation(node);
        // console.info(node);
    });
}
