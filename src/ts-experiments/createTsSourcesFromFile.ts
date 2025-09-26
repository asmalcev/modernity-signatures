import ts from 'typescript';

export const createTsSourcesFromFile = (sourceCodeFileName: string) => {
    const program = ts.createProgram([sourceCodeFileName], {
        allowJs: true,
        declaration: true,
        emitDeclarationOnly: true,
    });

    const typeChecker = program.getTypeChecker();

    const tsSourceFile = program.getSourceFile(sourceCodeFileName);

    if (!tsSourceFile) {
        throw new Error('No tsSourceFile found');
    }

    return { program, tsSourceFile, typeChecker };
};
