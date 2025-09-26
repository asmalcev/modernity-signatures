import ts from 'typescript';

// @ts-ignore
const libModules = import.meta.glob('typescript/lib/lib.d.ts', {
    as: 'raw',
    eager: true,
}) as Record<string, string>;

export const allLibFiles = new Map<string, string>(
    Object.entries(libModules).map(([k, v]) => [
        k.replace(/^.*\/lib\//, '/lib/'),
        v,
    ])
);

export const createInMemoryCompilerHost = (
    filesMap: Map<string, string>,
    options: ts.CompilerOptions
): ts.CompilerHost => {
    const cache = new Map<string, ts.SourceFile>();

    return {
        getSourceFile(fileName, languageVersion) {
            const text = filesMap.get(fileName);
            if (text == null) return undefined;
            let sf = cache.get(fileName);
            if (!sf) {
                const kind = fileName.endsWith('.tsx')
                    ? ts.ScriptKind.TSX
                    : fileName.endsWith('.ts')
                    ? ts.ScriptKind.TS
                    : ts.ScriptKind.TS;
                sf = ts.createSourceFile(
                    fileName,
                    text,
                    languageVersion,
                    true,
                    kind
                );
                cache.set(fileName, sf);
            }
            return sf;
        },
        getDefaultLibFileName: () => 'lib.d.ts',
        writeFile: () => {},
        getCurrentDirectory: () => '/',
        getNewLine: () => '\n',
        useCaseSensitiveFileNames: () => true,
        getCanonicalFileName: (f) => f,
        fileExists: (f) => filesMap.has(f),
        readFile: (f) => filesMap.get(f),
        directoryExists: () => true,
        getDirectories: () => [],
        ...options,
    };
};
