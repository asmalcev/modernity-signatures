import parserMappings from '../parserMapping.json';

export const matchPattern = (node, pattern) => {
    for (const key in pattern) {
        if (pattern[key] !== node[key]) {
            return false;
        }
    }
    return true;
};

export const matchNode = (node) => {
    const { type } = node;

    const mapped = parserMappings[type];

    if (typeof mapped === 'string') return mapped;

    if (!Array.isArray(mapped)) return null;

    for (const variant of mapped) {
        const { __type, __parent, ...pattern } = variant;

        const isMatched = matchPattern(node, pattern);
        if (isMatched) return __type;
    }

    return null;
};
