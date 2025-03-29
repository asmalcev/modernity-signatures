const isSomeConditionTrue = Math.random() > 0.5;

const iterable = isSomeConditionTrue ? [1, 2, 3] : new Set([1, 2, 3]);

for (const item of iterable) {
    console.log(item);
}
