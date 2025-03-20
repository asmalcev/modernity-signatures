import ts from 'typescript';

/**
 * Функция-фабрика для создания функции getTypeScriptType.
 * @param {string} sourceCode - Исходный код, из которого будет создан AST TypeScript.
 * @returns {Function} - Функция, принимающая узел AST Babel и возвращающая тип TypeScript.
 */
export function createGetTypeScriptType(sourceCode) {
    // 1. Создаём AST TypeScript из исходного кода
    const tsSourceFile = ts.createSourceFile(
        'temp.ts', // Имя файла (фиктивное)
        sourceCode,
        ts.ScriptTarget.Latest,
        /* setParentNodes */ true
    );

    // 2. Создаём программу TypeScript для анализа типов
    const compilerOptions = {
        allowJs: true,
        checkJs: true,
        noEmit: true,
        strict: true, // Включаем строгую проверку типов
        target: ts.ScriptTarget.Latest,
    };

    const program = ts.createProgram({
        rootNames: ['temp.ts'],
        options: compilerOptions,
        host: createCompilerHost(sourceCode),
    });

    const checker = program.getTypeChecker();

    /**
     * Функция для получения типа TypeScript для узла AST Babel.
     * @param {Object} babelNode - Узел AST, созданный с помощью Babel.
     * @returns {string | null} - Тип TypeScript или null, если тип не определён.
     */
    return function getTypeScriptType(babelNode) {
        // 3. Находим соответствующий узел в AST TypeScript
        const tsNode = findMatchingTSNode(babelNode, tsSourceFile);
        if (!tsNode) {
            return null;
        }

        // 4. Получаем тип узла TypeScript
        let type = checker.getTypeAtLocation(tsNode);

        // Если тип не определён или равен any, пробуем получить его из контекста или значения
        if (type.flags === ts.TypeFlags.Any) {
            if (tsNode.type) {
                // Если есть явная аннотация типа, используем её
                type = checker.getTypeFromTypeNode(tsNode.type);
            } else if (ts.isVariableDeclaration(tsNode) && tsNode.initializer) {
                // Если есть инициализатор, получаем тип из значения
                type = checker.getTypeAtLocation(tsNode.initializer);
            }
        }

        // Преобразуем тип в строку, но учитываем базовые типы для литералов
        return getBaseTypeString(type, checker);
    };
}

/**
 * Вспомогательная функция для получения базового типа (например, "string" вместо "hello").
 * @param {ts.Type} type - Тип TypeScript.
 * @param {ts.TypeChecker} checker - Проверщик типов TypeScript.
 * @returns {string} - Базовый тип в виде строки.
 */
function getBaseTypeString(type, checker) {
    if (type.flags & ts.TypeFlags.StringLiteral) {
        // Для строковых литералов возвращаем "string"
        return 'string';
    } else if (type.flags & ts.TypeFlags.NumberLiteral) {
        // Для числовых литералов возвращаем "number"
        return 'number';
    } else if (type.flags & ts.TypeFlags.BooleanLiteral) {
        // Для булевых литералов возвращаем "boolean"
        return 'boolean';
    }

    // Для всех остальных типов используем стандартное преобразование
    return checker.typeToString(type);
}

/**
 * Вспомогательная функция для создания хоста компилятора TypeScript.
 * @param {string} sourceCode - Исходный код.
 * @returns {ts.CompilerHost} - Хост компилятора TypeScript.
 */
function createCompilerHost(sourceCode) {
    return {
        getSourceFile: (fileName) => {
            if (fileName === 'temp.ts') {
                return ts.createSourceFile(fileName, sourceCode, ts.ScriptTarget.Latest, true);
            }
            return undefined;
        },
        getDefaultLibFileName: () => 'lib.d.ts',
        writeFile: () => {},
        getCurrentDirectory: () => '',
        getCanonicalFileName: (fileName) => fileName,
        useCaseSensitiveFileNames: () => true,
        getNewLine: () => '\n',
        fileExists: (fileName) => fileName === 'temp.ts',
        readFile: () => '',
    };
}

/**
 * Вспомогательная функция для поиска соответствующего узла в AST TypeScript.
 * @param {Object} babelNode - Узел AST Babel.
 * @param {ts.Node} tsNode - Корневой узел AST TypeScript.
 * @returns {ts.Node | null} - Соответствующий узел TypeScript или null.
 */
function findMatchingTSNode(babelNode, tsNode) {
    // Простая реализация: сравниваем позиции начала и конца узлов
    if (
        tsNode.getStart() === babelNode.start &&
        tsNode.getEnd() === babelNode.end
    ) {
        return tsNode;
    }

    // Рекурсивно проверяем дочерние узлы
    return ts.forEachChild(tsNode, (child) => findMatchingTSNode(babelNode, child));
}
