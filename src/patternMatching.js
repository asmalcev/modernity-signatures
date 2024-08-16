import parserMappings from '../parserMapping.json';
import { log, rlog } from './log';

export const matchPattern = (node, _pattern, stack) => {
    const { __negative, __parent, __any_parent, ...pattern } = _pattern;

    if (!node) {
        return Boolean(__negative);
    }

    if (typeof _pattern === 'string' && typeof node.type === 'string') {
        return node.type === _pattern;
    }

    for (const key in pattern) {
        let isMatched = true;

        if (Array.isArray(pattern[key])) {
            for (const variant of pattern[key]) {
                // at least one of variants has matched
                isMatched ||= matchPattern(node[key], variant[key], stack);
            }
        } else if (typeof pattern[key] === 'string') {
            // strict equality of string properties
            isMatched = pattern[key] === node[key];
        } else {
            // node matches pattern
            isMatched = matchPattern(node[key], pattern[key], stack);
        }

        if (!isMatched && !__negative) {
            // if did not match and positive check -> fast return
            return Boolean(__negative);
        }
    }

    if (__parent) {
        const parentNode = stack[stack.length - 2];
        let isMatched = false;

        if (Array.isArray(__parent)) {
            for (const variant of __parent) {
                isMatched ||= matchPattern(parentNode, variant, stack);
            }
        } else {
            isMatched = matchPattern(parentNode, __parent, stack);
        }

        if (!isMatched && !__negative) {
            // if did not match and positive check -> fast return
            return false;
        }
    }

    if (__any_parent) {
        let isMatched = false;

        if (Array.isArray(__any_parent)) {
            for (const variant of __any_parent) {
                for (const parentNode of stack) {
                    isMatched ||= matchPattern(parentNode, variant, stack);
                }
            }
        } else {
            for (const parentNode of stack) {
                isMatched ||= matchPattern(parentNode, __any_parent, stack);
            }
        }

        if (!isMatched && !__negative) {
            // if did not match and positive check -> fast return
            return false;
        }
    }

    return !__negative;
};

export const matchNode = (node, stack) => {
    const { type } = node;

    const mapped = parserMappings[type];

    if (typeof mapped === 'string') return rlog('PATTERN IS STRING') || mapped;

    if (!Array.isArray(mapped)) return rlog('UNDEFINED BEHAIVOR') || null;

    for (const variant of mapped) {
        if (typeof variant === 'string') {
            return rlog(`MATCH VARIANT ${variant}`) || variant;
        }

        const { __type, ...pattern } = variant;
        const isMatched = matchPattern(node, pattern, stack);

        log('CHECK VARIANT', __type, isMatched);
        if (isMatched) return rlog(`MATCH VARIANT ${__type}`) || __type;
    }

    rlog('PATTERN WAS NOT FOUND');
    return null;
};
