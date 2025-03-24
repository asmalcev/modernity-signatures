import ts from 'typescript';

export const createGetTypeScriptType = (sourceCodeFileName: string) => {
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

    const findMatchingTSNode = (
        _tsNode: ts.Node,
        babelNode: any
    ): ts.Node | undefined => {
        if (
            _tsNode.getStart() === babelNode.start &&
            _tsNode.getEnd() === babelNode.end
        ) {
            return _tsNode;
        }

        return ts.forEachChild(_tsNode, (child) =>
            findMatchingTSNode(child, babelNode)
        );
    };

    return (babelNode: any) => {
        const tsNode = findMatchingTSNode(tsSourceFile, babelNode);

        if (!tsNode) {
            console.log('No tsNode found');
            return null;
        }

        const symbol = typeChecker.getSymbolAtLocation(tsNode);

        if (!symbol) {
            console.log('No symbol found');
            return null;
        }

        const symbolType = typeChecker.getTypeOfSymbolAtLocation(
            symbol,
            tsNode
        );

        const flags = symbolType.getFlags();

        if (flags & ts.TypeFlags.Any) {
            return 'any';
        } else if (flags & ts.TypeFlags.BigInt) {
            return 'bigint';
        } else if (flags & ts.TypeFlags.Object) {
            return symbolType.symbol.name;
        } else if (
            flags & ts.TypeFlags.Number ||
            flags & ts.TypeFlags.NumberLiteral
        ) {
            return 'number';
        } else if (
            flags & ts.TypeFlags.String ||
            flags & ts.TypeFlags.StringLiteral
        ) {
            return 'string';
        } else if (flags & ts.TypeFlags.Undefined) {
            return 'undefined';
        } else if (flags & ts.TypeFlags.Void) {
            return 'void';
        } else if (flags & ts.TypeFlags.Null) {
            return 'null';
        } else if (flags & ts.TypeFlags.Boolean) {
            return 'boolean';
        } else if (flags & ts.TypeFlags.Never) {
            return 'never';
        } else if (flags & ts.TypeFlags.Unknown) {
            return 'unknown';
        } else if (flags & ts.TypeFlags.TemplateLiteral) {
            return 'template literal';
        } else if (flags & ts.TypeFlags.Enum) {
            return 'enum';
        } else if (flags & ts.TypeFlags.Union) {
            return 'union';
        } else if (flags & ts.TypeFlags.Intersection) {
            return 'intersection';
        } else if (flags & ts.TypeFlags.BooleanLiteral) {
            return 'boolean';
        } else if (flags & ts.TypeFlags.BigIntLiteral) {
            return 'big int literal';
        }

        return null;
    };
};
