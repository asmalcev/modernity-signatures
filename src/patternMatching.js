import parserMappings from '../parserMapping.json';

export const matchPattern = (node, _pattern) => {
    const { __negative, ...pattern } = _pattern;

    if (!node) {
        // console.info('no node to check');
        return __negative;
    }

    // console.info(node, __negative, pattern);

    for (const key in pattern) {
        let isMatched = true;

        if (Array.isArray(pattern[key])) {
            // console.info('check', key, 'array');
        } else if (typeof pattern[key] === 'string') {
            // console.info('check', key, 'string');
            isMatched = pattern[key] === node[key];
        } else {
            // console.info('check', key, 'object');
            isMatched = matchPattern(node[key], pattern[key]);
        }

        if (!isMatched && !__negative) {
            // console.log('fast end', __negative);
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
        const { __type, __parent, ...pattern } = variant;

        const isMatched = matchPattern(node, pattern);
        if (isMatched) return __type;
    }

    return null;
};
