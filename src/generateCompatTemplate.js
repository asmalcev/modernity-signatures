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

console.log(
    JSON.stringify(
        flatten(
            Object.fromEntries(
                Object.entries(bcd.javascript).map(([key, features]) => [
                    key,
                    cutRecursive(features),
                ])
            )
        )
    )
);
