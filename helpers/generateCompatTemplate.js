import bcd from '@mdn/browser-compat-data';
import { flatten } from 'flat';

const replaceEmptyObjectWithEmptyString = (obj) =>
    Object.keys(obj).length === 0 ? '' : obj;

const cut = ({ __compat, ...other }) => other;
const cutRecursive = (feature) =>
    Object.fromEntries(
        Object.entries(cut(feature)).map(([key, value]) => [
            key,
            replaceEmptyObjectWithEmptyString(cutRecursive(value)),
        ])
    );

const reducePath = (keys) =>
    keys.length > 1 ? [...reducePath(keys.slice(0, -1)), keys.join('.')] : keys;

const addReducesPaths = (paths) => ({
    ...paths,
    ...Object.fromEntries(
        Object.keys(paths)
            .filter((path) => path.includes('.'))
            .flatMap((path) => reducePath(path.split('.')))
            .map((path) => [path, ''])
    ),
});

const bcdToCompatMapping = (bcd) =>
    Object.fromEntries(
        Object.entries(
            addReducesPaths(
                flatten(
                    Object.fromEntries(
                        Object.entries(bcd).map(([key, features]) => [
                            key,
                            cutRecursive(features),
                        ])
                    )
                )
            )
        ).sort((path1, path2) => path1[0].localeCompare(path2[0]))
    );

console.log(JSON.stringify(bcdToCompatMapping(bcd.javascript)));
