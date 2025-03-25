import { matchNode } from './patternMatching';
import { KEYS, NODE_KEYS } from './keysToLookup';
import { MemberExpression, Statement } from '@babel/types';
import { GetTypeScriptType } from './ts-experiments/interfaces';

const keysToLookup = new Set(KEYS);

export const scan = (
    rootNode: Statement[],
    getTypeScriptType: GetTypeScriptType
) => {
    const report: Record<string, Statement[]> = {};

    const addToReport = (key: string, node: Statement) => {
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
            if (node === null) return;

            if (node.type.valueOf() === 'MemberExpression') {
                const memberExpressionNode =
                    node as unknown as MemberExpression;

                const dynamicType = getTypeScriptType(
                    memberExpressionNode.object
                );
                Object.defineProperty(memberExpressionNode, '__dynamicType', {
                    value: dynamicType,
                    enumerable: true,
                });
            }

            const matched = matchNode(node, stack);

            console.log(node.type, '->', matched);

            if (matched !== null) {
                addToReport(matched, node);
            }

            for (const key in node) {
                if (keysToLookup.has(key as NODE_KEYS)) {
                    const isArrayInKey = Array.isArray(
                        node[key as keyof Statement]
                    );
                    scanRecursive(
                        // @ts-ignore
                        node[key],
                        // @ts-ignore
                        isArrayInKey ? stack : [...stack, node[key]]
                    );
                }
            }
        }
    };

    scanRecursive(rootNode, []);

    return report;
};
