import { Pattern } from './interfaces';

export const PatternTypeGuard = (object: unknown): object is Pattern =>
    typeof object === 'string' || typeof object === 'object';
