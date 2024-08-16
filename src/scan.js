import { matchNode } from './patternMatching';

const keysToLookup = new Set([
    'init',
    'declarations',
    'body',
    'test',
    'update',
    'left',
    'right',
    'expression',
    'expressions',
    'argument',
    'arguments',
    'elements',
    'object',
    'property',
    'properties',
    'params',
    'callee',
    'consequent',
    'alternate',
    'discriminant',
    'cases',
    'value',
    'key',
    'handler',
]);

export const scan = (rootNode) => {
    const report = {};

    const addToReport = (key, node) => {
        if (key === null) return;

        if (report[key]) {
            report[key].push(node);
        } else {
            report[key] = [node];
        }
    };

    const scanRecursive = (node, stack = []) => {
        if (Array.isArray(node)) {
            for (const subnode of node) {
                scanRecursive(subnode, [...stack, node]);
            }
        } else if (typeof node === 'object') {
            const matched = matchNode(node, stack);

            console.log(node.type, '->', matched, '\n -- --\n');

            addToReport(matched, node);

            for (const key in node) {
                if (keysToLookup.has(key)) {
                    scanRecursive(node[key], [...stack, node]);
                }
            }
        }
    };

    scanRecursive(rootNode);

    return report;
};
