import compatMapping from '../compatMapping.json';
import bcd from '@mdn/browser-compat-data';

const compatMappingEntries = Object.entries(compatMapping);

const getByPath = (path: string) =>
    path.split('.').reduce((acc, key) => acc[key], bcd.javascript);

export const getBrowserSupport = (featureKey: string) => {
    const entry = compatMappingEntries.find(
        ([, feature]) => feature === featureKey
    );

    if (!entry) {
        return null;
    }

    return getByPath(entry[0]);
};
