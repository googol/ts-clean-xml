export const chain = <T, R>(selector: (value: T) => ReadonlyArray<R>) => (input: ReadonlyArray<T>): R[] => {
    const result: R[] = [];
    for (const value of input) {
        for (const mappedValue of selector(value)) {
            result.push(mappedValue);
        }
    }
    return result;
};

export type ReduceStep<Accumulator, Value> = (acc: Accumulator, current: Value) => Accumulator;

export const reduce = <T, R>(reducer: ReduceStep<R, T>) => (initial: R) => (values: ReadonlyArray<T>): R => {
    let accumulator = initial;

    for (const value of values) {
        accumulator = reducer(accumulator, value);
    }

    return accumulator;
};

export const flatten = <T>(input: ReadonlyArray<ReadonlyArray<T>>): T[] => {
    const result = [];
    for (const outer of input) {
        for (const inner of outer) {
            result.push(inner);
        }
    }
    return result;
};
