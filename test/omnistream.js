import test from 'ava';
import createOmnistream from '../src/omnistream.js';
import Rx from 'rxjs/rx';

const omnistream = createOmnistream();

test('omnistream has a behavior subject stream', (t) => {
  t.plan(1);
  t.true(omnistream.stream instanceof Rx.BehaviorSubject);
})

test('omnistream has history array', (t) => {
  t.plan(2);
  t.true(omnistream.hasOwnProperty('history'));
  t.true(Array.isArray(omnistream.history));
})

test('omnistream has history$ observable', (t) => {
  t.plan(2);
  t.true(omnistream.hasOwnProperty('history$'));
  t.true(omnistream.history$ instanceof Rx.Observable);
})

test('omnistream has store object with omniHistory$ observable', (t) => {
  t.plan(3);
  t.true(omnistream.hasOwnProperty('store'));
  t.true(typeof omnistream.store === 'object');
  t.true(omnistream.store.omniHistory$ instanceof Rx.Observable);
})

test('clearState emits action with _clearState and _ignore properties', (t) => {
  
})