import compatMappingOld from '../compatMapping.json';
import compatMapping from '../compatMapping_new.json';

console.log(
    JSON.stringify(
        Object.fromEntries(
            Object.entries(compatMapping).map(([key, value]) => [
                key,
                compatMappingOld[key] ? compatMappingOld[key] : value,
            ])
        )
    )
);
