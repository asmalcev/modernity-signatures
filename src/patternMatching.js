import parserMappings from '../parserMapping.json';

export const matchPattern = (node, _pattern) => {
    const { __negative, ...pattern } = _pattern;

    if (!node) {
        return __negative;
    }

    for (const key in pattern) {
        let isMatched = true;

        if (Array.isArray(pattern[key])) {
            for (const variant of pattern[key]) {
                // at least one of variants has matched
                isMatched ||= matchPattern(node[key], variant[key]);
            }
        } else if (typeof pattern[key] === 'string') {
            // strict equality of string properties
            isMatched = pattern[key] === node[key];
        } else {
            // node matches pattern
            isMatched = matchPattern(node[key], pattern[key]);
        }

        if (isMatched === __negative) {
            // if did not match and positive check -> fast return
            // if matched and negative check -> fast return
            return __negative;
        }
    }

    return !__negative;
};

export const matchNode = (node) => {
    const { type } = node;

    const mapped = parserMappings[type];

    if (typeof mapped === 'string') return mapped;

    if (!Array.isArray(mapped)) return null;

    for (const variant of mapped) {
        const { __type, ...pattern } = variant;

        const isMatched = matchPattern(node, pattern);
        if (isMatched) return __type;
    }

    return null;
};
