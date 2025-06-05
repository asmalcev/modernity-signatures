import fs from 'fs';

import babelParser from '@babel/parser';

export const getBabelAST = (sourceCodeFileName) =>
    babelParser.parse(
        fs.readFileSync(sourceCodeFileName, {
            encoding: 'utf-8',
        }),
        {
            sourceType: 'module',
            plugins: ['typescript'],
        }
    );