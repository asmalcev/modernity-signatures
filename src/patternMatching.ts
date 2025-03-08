import { Statement } from '@babel/types';
import untypedParserMappings from '../parserMapping.json';
import { ParserMappings, PatternWithoutInternalType } from './interfaces';
import { glog, log, rlog } from './log';
import { PatternTypeGuard } from './typeguards';

const parserMappings: ParserMappings = untypedParserMappings;

export const matchPattern = (
    node: Statement,
    _pattern: PatternWithoutInternalType,
    stack: Statement[]
) => {
    if (typeof _pattern === 'string') {
        // glog(`FAST RESULT ${_pattern}`);
        // console.log(node);
        return node.type === _pattern;
    }

    const { __negative, __parent, __any_parent, __dynamicType, ...pattern } = _pattern;

    if (__dynamicType) {
        glog(`CHECK DYNAMIC TYPE ${__dynamicType}`);
    }

    if (!node) {
        glog(`NODE IS UNDEFINED`);
        return Boolean(__negative);
    }

    for (const key in pattern) {
        let isMatched = true;

        if (Array.isArray(pattern[key])) {
            isMatched = false;
            for (const variant of pattern[key]) {
                console.info('CHECK VARIANT', variant, isMatched);
                // at least one of variants has matched
                isMatched ||= matchPattern(node[key], variant, stack);
            }
        } else if (
            ['string', 'number', 'boolean'].includes(typeof pattern[key])
        ) {
            // strict equality of string or number properties
            isMatched = pattern[key] === node[key];
        } else if (PatternTypeGuard(pattern[key])) {
            // node matches pattern
            isMatched = matchPattern(node[key], pattern[key], stack);
        }

        if (!isMatched && !__negative) {
            // if did not match and positive check -> fast return
            glog(`FAST DID NOT MATCH PROPERTY`);
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
        } else if (PatternTypeGuard(__parent)) {
            isMatched = matchPattern(parentNode, __parent, stack);
        }

        if (!isMatched && !__negative) {
            // if did not match and positive check -> fast return
            glog(`FAST DID NOT MATCH PARENT`);
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
        } else if (PatternTypeGuard(__any_parent)) {
            for (const parentNode of stack) {
                isMatched ||= matchPattern(parentNode, __any_parent, stack);
            }
        }

        if (!isMatched && !__negative) {
            // if did not match and positive check -> fast return
            glog(`FAST DID NOT MATCH ANY PARENT`);
            return false;
        }
    }

    glog(`ALL CHECKS PASSED`);
    return !__negative;
};

export const matchNode = (node: Statement, stack: Statement[]) => {
    const { type } = node;

    const mapped = parserMappings[type];

    if (typeof mapped === 'string') {
        rlog('PATTERN IS STRING');
        return mapped;
    }

    if (!Array.isArray(mapped)) {
        rlog('UNDEFINED BEHAIVOR');
        return null;
    }

    for (const variant of mapped) {
        if (typeof variant === 'string') {
            rlog(`MATCH VARIANT ${variant}`);
            return variant;
        }

        const { __type, ...pattern } = variant;
        const isMatched = matchPattern(node, pattern, stack);

        log('CHECK VARIANT', __type, isMatched);
        if (isMatched) {
            rlog(`MATCH VARIANT ${__type}`);
            return __type;
        }
    }

    rlog('PATTERN WAS NOT FOUND');
    return null;
};
