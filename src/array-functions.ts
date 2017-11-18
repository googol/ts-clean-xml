export const chain = <T, R>(selector: (value: T) => R[]) => (input: T[]): R[] => {
    const result: R[] = [];
    for (const value of input) {
        for (const mappedValue of selector(value)) {
            result.push(mappedValue);
        }
    }
    return result;
};

export const reduce = <T, R>(reducer: (acc: R, current: T) => R) => (initial: R) => (values: T[]): R => {
    let accumulator = initial;

    for (const value of values) {
        accumulator = reducer(accumulator, value);
    }

    return accumulator;
};
