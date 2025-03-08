import { matchNode } from './patternMatching';
import { KEYS, NODE_KEYS } from './keysToLookup';
import { Statement } from '@babel/types';

const keysToLookup = new Set(KEYS);

const hashNode = (node: Statement) => `start-${node.start}|end-${node.end}`;
// const hashNode = (node: Statement) => node.type;

export const scan = (rootNode: Statement[]) => {
    const report = {};

    const addToReport = (key, node) => {
        if (key === null) return;

        if (report[key]) {
            report[key].push(node);
        } else {
            report[key] = [node];
        }
    };

    const scanRecursive = (
        node: Statement | Statement[],
        stack: Statement[]
    ) => {
        if (Array.isArray(node)) {
            for (const subnode of node) {
                scanRecursive(subnode, [...stack, subnode]);
            }
        } else if (typeof node === 'object') {
            const matched = matchNode(node, stack);

            console.log(node.type, '->', matched);
            // console.info(
            //     matched || node.type,
            //     stack.map((n) => hashNode(n)),
            //     '\n'
            // );

            addToReport(matched, node);

            for (const key in node) {
                if (keysToLookup.has(key as NODE_KEYS)) {
                    const isArrayInKey = Array.isArray(node[key]);
                    scanRecursive(node[key], isArrayInKey ? stack : [...stack, node[key]]);
                }
            }
        }
    };

    scanRecursive(rootNode, []);

    return report;
};
