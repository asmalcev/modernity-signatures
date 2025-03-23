import { describe, expect, test } from 'vitest';
import { matchNode } from './patternMatching';

describe('Match Node Tests', () => {
    test(`STRING: Return internal type if node maps to string`, () => {
        expect(matchNode({ type: 'EmptyStatement' })).toBe('EmptyStatement');
    });

    test('VARIANTS: Return internal type if node maps to one of the variants', () => {
        expect(matchNode({ type: 'VariableDeclaration', kind: 'let' })).toBe(
            'LetVariableDeclaration'
        );
    });

    test('VARIANTS: Return null if node does not maps to any of the variants', () => {
        expect(matchNode({ type: 'VariableDeclaration' })).toBe(null);
    });

    test('VARIANTS: Return null if node does not maps to any pattern', () => {
        expect(matchNode({ type: 'ThisTypeDoesntExist' })).toBe(null);
    });

    test('PROPS AS PATTERNS: Node as one of properties of pattern', () => {
        expect(
            matchNode({
                type: 'TryStatement',
                finalizer: { type: 'BlockStatement' },
            })
        ).toBe('OptionalCatchBindingTryStatement');
    });

    test('PROPS AS PATTERNS: Node as one of properties of pattern', () => {
        expect(
            matchNode({
                type: 'TryStatement',
                handler: { type: 'CatchClause' },
                finalizer: { type: 'BlockStatement' },
            })
        ).toBe('OptionalCatchBindingTryStatement');
    });

    test('PROPS AS PATTERNS: Node as one of properties of pattern', () => {
        expect(
            matchNode({
                type: 'TryStatement',
                handler: {
                    type: 'CatchClause',
                    param: { type: 'Identifier' },
                },
            })
        ).toBe('TryStatement');
    });

    test('PROPS AS PATTERNS: Node as one of properties of pattern', () => {
        expect(
            matchNode({
                type: 'TryStatement',
                handler: {
                    type: 'CatchClause',
                    param: { type: 'Identifier' },
                },
                finalizer: { type: 'BlockStatement' },
            })
        ).toBe('TryStatement');
    });

    test('PARENT: Detect type based on its parent', () => {
        expect(
            matchNode(
                {
                    type: 'SpreadElement',
                },
                [
                    {
                        type: 'ObjectExpression',
                    },
                    {
                        type: 'SpreadElement',
                    },
                ]
            )
        ).toBe('ObjectSpreadElement');
    });

    test('ANY PARENT: Detect type based on any of its parents', () => {
        expect(
            matchNode(
                {
                    type: 'AwaitExpression',
                },
                [
                    {
                        type: 'AwaitExpression',
                    },
                ]
            )
        ).toBe('TopLevelAwaitExpression');
    });
});
