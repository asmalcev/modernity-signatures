export const KEYS = [
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
    'block',
] as const;

export type NODE_KEYS = (typeof KEYS)[number];
