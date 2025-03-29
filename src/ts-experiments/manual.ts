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

    const getType = ({
        flags,
        nodeType,
    }: {
        flags: ts.TypeFlags;
        nodeType: ts.Type;
    }) => {
        if (flags & ts.TypeFlags.Any) {
            return 'any';
        } else if (
            flags & ts.TypeFlags.BigInt ||
            flags & ts.TypeFlags.BigIntLiteral
        ) {
            return 'bigint';
        } else if (flags & ts.TypeFlags.Object) {
            return nodeType.symbol.name;
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
        } else if (
            flags & ts.TypeFlags.Boolean ||
            flags & ts.TypeFlags.BooleanLiteral
        ) {
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
            const unionType = nodeType as ts.UnionType;
            const unionResult: any = [];

            for (const subType of unionType.types) {
                unionResult.push(
                    getType({ flags: subType.getFlags(), nodeType: subType })
                );
            }

            return unionResult as Array<string | null>;
        } else if (flags & ts.TypeFlags.Intersection) {
            return 'intersection';
        }

        return null;
    };

    return (babelNode: any) => {
        const tsNode = findMatchingTSNode(tsSourceFile, babelNode);

        if (!tsNode) {
            console.error('No tsNode found');
            return null;
        }

        if (ts.isCallExpression(tsNode)) {
            const nodeType = typeChecker.getTypeAtLocation(tsNode);
            const flags = nodeType.getFlags();

            return getType({ flags, nodeType });
        }

        const symbol = typeChecker.getSymbolAtLocation(tsNode);

        if (!symbol) {
            console.error('No symbol found');
            return null;
        }

        const symbolType = typeChecker.getTypeOfSymbolAtLocation(
            symbol,
            tsNode
        );

        const flags = symbolType.getFlags();

        return getType({ flags, nodeType: symbolType });
    };
};
