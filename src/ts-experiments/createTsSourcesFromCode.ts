import ts from 'typescript';
import {
    allLibFiles,
    createInMemoryCompilerHost,
} from './createInMemoryCompilerHost';

export const createTsSourcesFromCode = (code: string) => {
    const fileName = 'inmemory.ts';
    const compilerOptions: ts.CompilerOptions = {
        target: ts.ScriptTarget.ESNext,
        module: ts.ModuleKind.ESNext,
        strict: true,
        noEmit: true,
        noLib: false,
    };

    const files = new Map(allLibFiles);
    files.set(fileName, code);

    const host = createInMemoryCompilerHost(files, compilerOptions);

    const rootNames = [fileName, ...files.keys()];

    const program = ts.createProgram(rootNames, compilerOptions, host);
    const tsSourceFile = program.getSourceFile(fileName);
    if (!tsSourceFile) throw new Error('Error creating SourceFile.');

    const typeChecker = program.getTypeChecker();

    return { tsSourceFile, program, typeChecker };
};
