const array = [...[1, 2, 3], 4, 5];

const object = { ...{ a: 1, b: 2 }, c: 3 };

const func = (a, b, c, ...args) => a + b + c + args;

func(...array);
