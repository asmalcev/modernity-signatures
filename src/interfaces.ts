import { Statement } from '@babel/types';
import { NODE_KEYS } from './keysToLookup';

export type DynamicType = 'Array' | 'Object' | 'String' | 'Number' | 'Boolean';

export type UnkownObject = Partial<
    Record<NODE_KEYS, string | number | boolean | Object>
>;

type ObjectPattern = {
    __type: string;
    __negative?: boolean;
    __parent?: Pattern[] | string;
    __any_parent?: Pattern[] | string;
    __dynamicType?: DynamicType;
} & UnkownObject;

type StringPattern = string;

export type Pattern = ObjectPattern | StringPattern;

export type PatternWithoutInternalType =
    | Omit<ObjectPattern, '__type'>
    | StringPattern;

export type ParserMappings = Partial<
    Record<Statement['type'], Pattern[] | string>
>;

export type ParserNode = {
    type: string;
} & UnkownObject;

export type JSTypes =
    | 'null'
    | 'undefined'
    | 'number'
    | 'string'
    | 'object'
    | 'array'
    | 'boolean';

export type Scope = Record<string, JSTypes>;
