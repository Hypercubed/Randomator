/* eslint-disable @typescript-eslint/ban-types */

import { expectAssignable, expectNotType, expectType } from 'tsd';

import { Randomator } from './randomator.js';

// from a value
const a$ = Randomator.from('a');
expectAssignable<Function>(a$);
expectAssignable<() => string>(a$);
expectAssignable<Iterable<string>>(a$);
expectType<Randomator<string>>(a$);
expectType<string>(a$());

const b$ = Randomator.from(5);
expectType<number>(b$());

// from a function
const c$ = Randomator.from(() => 'c');
expectType<string>(c$());

const d$ = Randomator.from(() => 5);
expectType<number>(d$());

// constructor
const e$ = new Randomator(() => Math.random());
expectType<number>(e$());

// M(M(a)) === M(a)
const f$ = new Randomator(a$);
expectType<string>(f$());

const g$ = Randomator.from(f$);
expectType<string>(g$());

// map
const h$ = e$.map(a => String(a));
expectNotType<number>(h$());
expectType<string>(h$());

// chain
const i = e$.chain(a => a + a);
expectType<number>(i);

// filter
const j$ = e$.filter(a => a > 0.5);
expectType<number>(j$());

// toArray
const k = e$.toArray(5);
expectType<number[]>(k);
