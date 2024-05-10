import { describe, expect, test } from 'vitest';
import { matchNode } from './patternMatching';

describe('Match Node Tests', () => {
    test('Return internal type if node maps to string', () => {
        expect(matchNode({ type: 'EmptyStatement' })).toBe('EmptyStatement');
    });

    test('Return internal type if node maps to one of the variants', () => {
        expect(matchNode({ type: 'VariableDeclaration', kind: 'let' })).toBe(
            'LetVariableDeclaration'
        );
    });

    test('Return null if node does not maps to any of the variants', () => {
        expect(matchNode({ type: 'VariableDeclaration' })).toBe(null);
    });

    test('Node as one of properties of template', () => {
        expect(
            matchNode({
                type: 'TryStatement',
                finalizer: { type: 'BlockStatement' },
            })
        ).toBe('OptionalCatchBindingTryStatement');
    });

    test('Node as one of properties of template', () => {
        expect(
            matchNode({
                type: 'TryStatement',
                handler: { type: 'CatchClause' },
            })
        ).toBe('TryStatement');
    });
});
