/* eslint-disable @typescript-eslint/ban-types */

import { expectAssignable, expectType } from 'tsd';
import { Randomator } from '../randomator';
import { array, oneOf, record, tuple } from './core';

const number$ = Randomator.from(() => Math.random());

const abc$ = oneOf(['a', 'b', 'c']);
expectAssignable<Function>(abc$);
expectAssignable<() => string>(abc$);
expectAssignable<Iterable<string>>(abc$);
expectType<Randomator<string>>(abc$);
expectType<string>(abc$());

const ab1$ = oneOf(['a', 'b', 1]);
expectAssignable<Function>(ab1$);
expectAssignable<() => string | number>(ab1$);
expectAssignable<Iterable<string | number>>(ab1$);
expectType<Randomator<string | number>>(ab1$);
expectType<string | number>(ab1$());

const r$ = record({ abc: abc$, ab1: ab1$, number: number$ });
expectType<string>(r$().abc);
expectType<string | number>(r$().ab1);
expectType<number>(r$().number);

const t$ = tuple([abc$, ab1$, number$, number$]);
expectType<(string | number)[]>(t$());
expectType<string>(t$()[0]);
expectType<string | number>(t$()[1]);
expectType<number>(t$()[2]);

const a$ = array(abc$, 3);
expectType<string[]>(a$());

const b$ = array(ab1$, 3);
expectType<(string | number)[]>(b$());
