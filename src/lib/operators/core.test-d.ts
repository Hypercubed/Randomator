/* eslint-disable @typescript-eslint/ban-types */

import { expectAssignable, expectType } from 'tsd';
import { Randomator } from '../randomator';
import { array, oneOf, record, tuple } from './core';

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

const r$ = record({ abc: abc$, ab1: ab1$ });
expectType<Record<string, string | number>>(r$());

const t$ = tuple([abc$, ab1$]);
expectType<(string | number)[]>(t$());

const a$ = array(abc$, 3);
expectType<string[]>(a$());

const b$ = array(ab1$, 3);
expectType<(string | number)[]>(b$());
