import babel from '@babel/parser';
import fs from 'node:fs';

import { matchNode } from './patternMatching';

const data = fs.readFileSync('sandbox/awaits.js', {
    encoding: 'utf-8',
});

const parsed = babel.parse(data, {
    sourceType: 'module',
});

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

const scan = (node, stack = []) => {
    if (Array.isArray(node)) {
        for (const subnode of node) {
            scan(subnode, [...stack, node]);
        }
    } else if (typeof node === 'object') {
        const matched = matchNode(node, stack);
        console.info(node.type, '->', matched);

        for (const key in node) {
            if (keysToLookup.has(key)) {
                scan(node[key], [...stack, node]);
            }
        }
    }
};

scan(parsed.program.body);
