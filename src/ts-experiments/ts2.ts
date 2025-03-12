import * as ts from 'typescript';
import * as fs from 'fs';

interface DocEntry {
    name?: string;
    fileName?: string;
    documentation?: string;
    type?: string;
    constructors?: DocEntry[];
    parameters?: DocEntry[];
    returnType?: string;
}

function generateDocumentation(
    fileNames: string[],
    options: ts.CompilerOptions
): void {
    const program = ts.createProgram(fileNames, options);

    const checker = program.getTypeChecker();
    const output: DocEntry[] = [];

    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            ts.forEachChild(sourceFile, visit);
        }
    }

    fs.writeFileSync('classes.json', JSON.stringify(output, undefined, 4));

    return;

    function visit(node: ts.Node) {
        // Only consider exported nodes
        // if (!isNodeExported(node)) {
        //     return;
        // }

        if (ts.isClassDeclaration(node) && node.name) {
            // This is a top level class, get its symbol
            let symbol = checker.getSymbolAtLocation(node.name);
            if (symbol) {
                output.push(serializeClass(symbol));
            }
            // No need to walk any further, class expressions/inner declarations
            // cannot be exported
        } else if (ts.isModuleDeclaration(node)) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit);
        } else if (ts.isVariableDeclaration(node)) {
            console.info('variable declaration');
        } else if (ts.isVariableDeclarationList(node)) {
            console.info('variable declaration list');
        } else {
            console.info(node.kind, ts.SyntaxKind[node.kind])
        }

        ts.forEachChild(node, visit);
    }

    function serializeSymbol(symbol: ts.Symbol): DocEntry {
        return {
            name: symbol.getName(),
            documentation: ts.displayPartsToString(
                symbol.getDocumentationComment(checker)
            ),
            type: checker.typeToString(
                checker.getTypeOfSymbolAtLocation(
                    symbol,
                    symbol.valueDeclaration!
                )
            ),
        };
    }

    function serializeClass(symbol: ts.Symbol) {
        let details = serializeSymbol(symbol);

        // Get the construct signatures
        let constructorType = checker.getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration!
        );
        details.constructors = constructorType
            .getConstructSignatures()
            .map(serializeSignature);
        return details;
    }

    function serializeSignature(signature: ts.Signature) {
        return {
            parameters: signature.parameters.map(serializeSymbol),
            returnType: checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(
                signature.getDocumentationComment(checker)
            ),
        };
    }

    function isNodeExported(node: ts.Node): boolean {
        return (
            (ts.getCombinedModifierFlags(node as ts.Declaration) &
                ts.ModifierFlags.Export) !==
                0 ||
            (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
        );
    }
}

const filePath = 'sandbox/array.ts';

generateDocumentation([filePath], {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
});
