import path from 'path';

import { describe, expect, test } from 'vitest';

import { createGetTypeScriptType } from '../ts-experiments/manual';
import { scan } from '../scan';
import { getBabelAST } from './getBabelAST';

describe('[manual] getTypeScriptType tests', () => {
    test(`Variable with number`, () => {
        const sourceCodeFileName = path.join(
            __dirname,
            '../../sandbox/array_allMethods.ts'
        );

        const babelAST = getBabelAST(sourceCodeFileName);

        const getTypeScriptType = createGetTypeScriptType(sourceCodeFileName);

        const report = scan(babelAST.program.body, getTypeScriptType);

        const foundFeatures = Object.keys(report);

        expect(foundFeatures).to.contain('ArrayAtExpression');
        expect(foundFeatures).to.contain('ArrayConcatExpression');
        expect(foundFeatures).to.contain('ArrayCopyWithinExpression');
        expect(foundFeatures).to.contain('ArrayEntriesExpression');
        expect(foundFeatures).to.contain('ArrayEveryExpression');
        expect(foundFeatures).to.contain('ArrayFillExpression');
        expect(foundFeatures).to.contain('ArrayFilterExpression');
        expect(foundFeatures).to.contain('ArrayFindExpression');
        expect(foundFeatures).to.contain('ArrayFindIndexExpression');
        expect(foundFeatures).to.contain('ArrayFindLastExpression');
        expect(foundFeatures).to.contain('ArrayFindLastIndexExpression');
        expect(foundFeatures).to.contain('ArrayFlatExpression');
        expect(foundFeatures).to.contain('ArrayFlatMapExpression');
        expect(foundFeatures).to.contain('ArrayForEachExpression');
        expect(foundFeatures).to.contain('ArrayIncludesExpression');
        expect(foundFeatures).to.contain('ArrayIndexOfExpression');
        expect(foundFeatures).to.contain('ArrayJoinExpression');
        expect(foundFeatures).to.contain('ArrayKeysExpression');
        expect(foundFeatures).to.contain('ArrayLastIndexOfExpression');
        expect(foundFeatures).to.contain('ArrayMapExpression');
        expect(foundFeatures).to.contain('ArrayPopExpression');
        expect(foundFeatures).to.contain('ArrayPushExpression');
        expect(foundFeatures).to.contain('ArrayReduceExpression');
        expect(foundFeatures).to.contain('ArrayReduceRightExpression');
        expect(foundFeatures).to.contain('ArrayReverseExpression');
        expect(foundFeatures).to.contain('ArrayShiftExpression');
        expect(foundFeatures).to.contain('ArraySliceExpression');
        expect(foundFeatures).to.contain('ArraySomeExpression');
        expect(foundFeatures).to.contain('ArraySortExpression');
        expect(foundFeatures).to.contain('ArraySpliceExpression');
        expect(foundFeatures).to.contain('ArrayToLocaleStringExpression');
        expect(foundFeatures).to.contain('ArrayToReversedExpression');
        expect(foundFeatures).to.contain('ArrayToSortedExpression');
        expect(foundFeatures).to.contain('ArrayToSplicedExpression');
        expect(foundFeatures).to.contain('ArrayToStringExpression');
        expect(foundFeatures).to.contain('ArrayUnshiftExpression');
        expect(foundFeatures).to.contain('ArrayValuesExpression');
        expect(foundFeatures).to.contain('ArrayWithExpression');
        expect(foundFeatures).to.contain('ArrayLengthExpression');
        
    });
});
