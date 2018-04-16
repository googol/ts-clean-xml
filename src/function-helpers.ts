import { reduce } from './array-functions';

export type F1<T, R> = (input: T) => R;
export type F2<T1, T2, R> = (input: T1) => (input: T2) => R;
export type F3<T1, T2, T3, R> = (input: T1) => (input: T2) => (input: T3) => R;

export type Predicate<T> = F1<T, boolean>;

export function pipe<T1, T2, R>(f1: F1<T1, T2>, f2: F1<T2, R>): F1<T1, R>;
export function pipe<T1, T2, T3, R>(f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, R>): F1<T1, R>;
export function pipe<T1, T2, T3, T4, R>(f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, R>): F1<T1, R>;
export function pipe<T1, T2, T3, T4, T5, R>(f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, R>): F1<T1, R>;
export function pipe<T1, T2, T3, T4, T5, T6, R>(f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, T6>, f6: F1<T6, R>): F1<T1, R>;
export function pipe<T1, T2, T3, T4, T5, T6, T7, R>(f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, T6>, f6: F1<T6, T7>, f7: F1<T7, R>): F1<T1, R>;
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, R>(f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, T6>, f6: F1<T6, T7>, f7: F1<T7, T8>, f8: F1<T8, R>): F1<T1, R>;
export function pipe<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, T6>, f6: F1<T6, T7>, f7: F1<T7, T8>, f8: F1<T8, T9>, f9: F1<T9, R>): F1<T1, R>;
export function pipe(...args: F1<any, any>[]): F1<any, any> {
    const [ head, ...tail ] = args;
    return reduce<F1<any, any>, F1<any, any>>(composeFlipped)(head)(tail);
}

export function pipe_<T1, T2, R>(value: T1, f1: F1<T1, T2>, f2: F1<T2, R>): R;
export function pipe_<T1, T2, T3, R>(value: T1, f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, R>): R;
export function pipe_<T1, T2, T3, T4, R>(value: T1, f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, R>): R;
export function pipe_<T1, T2, T3, T4, T5, R>(value: T1, f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, R>): R;
export function pipe_<T1, T2, T3, T4, T5, T6, R>(value: T1, f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, T6>, f6: F1<T6, R>): R;
export function pipe_<T1, T2, T3, T4, T5, T6, T7, R>(value: T1, f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, T6>, f6: F1<T6, T7>, f7: F1<T7, R>): R;
export function pipe_<T1, T2, T3, T4, T5, T6, T7, T8, R>(value: T1, f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, T6>, f6: F1<T6, T7>, f7: F1<T7, T8>, f8: F1<T8, R>): R;
export function pipe_<T1, T2, T3, T4, T5, T6, T7, T8, T9, R>(value: T1, f1: F1<T1, T2>, f2: F1<T2, T3>, f3: F1<T3, T4>, f4: F1<T4, T5>, f5: F1<T5, T6>, f6: F1<T6, T7>, f7: F1<T7, T8>, f8: F1<T8, T9>, f9: F1<T9, R>): R;
export function pipe_(value: any, ...args: F1<any, any>[]): any {
    const [ head, ...tail ] = args;
    return reduce<F1<any, any>, F1<any, any>>(composeFlipped)(head)(tail)(value);
}

export function compose<T1, T2, R>(g: F1<T2, R>, f: F1<T1, T2>): F1<T1, R> {
    return (input) => g(f(input));
}

export function composeFlipped<T1, T2, R>(f: F1<T1, T2>, g: F1<T2, R>): F1<T1, R> {
    return (input) => g(f(input));
}
