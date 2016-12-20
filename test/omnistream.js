import test from 'ava';
import createOmnistream from '../src/omnistream.js';
import Rx from 'rxjs/rx';

const omnistream = createOmnistream();
test('omnistream has a behavior subject stream', (t) => {
  t.plan(1);
  t.true(omnistream.stream instanceof Rx.BehaviorSubject);
});

test('omnistream has history$ observable', (t) => {
  t.plan(2);
  t.true(omnistream.hasOwnProperty('history$'));
  t.true(omnistream.history$ instanceof Rx.Observable);
});

test('omnistream has store object with omniHistory$ observable', (t) => {
  t.plan(3);
  t.true(omnistream.hasOwnProperty('store'));
  t.true(typeof omnistream.store === 'object');
  t.true(omnistream.store.omniHistory$ instanceof Rx.Observable);
});

test('clearState emits action with _clearState and _ignore properties', (t) => {
  t.plan(2);
  const omnistream = createOmnistream();
  omnistream.clearState();
  return omnistream.stream.take(1).map((action) => {
    t.true(action._clearState);
    t.true(action._ignore);
  })
})

test('dispatch emits actions to omnistream', (t) => {
  t.plan(1);
  const omnistream = createOmnistream();
  omnistream.dispatch({ type: 'test' });
  return omnistream.stream.take(1).map((action) => {
    t.deepEqual({ type: 'test' }, action);
  })
})

test('dispatch throws error if no type provided', (t) => {
  t.plan(1);
  const omnistream = createOmnistream();
  t.throws(() => omnistream.dispatch({ notType: 'test' }),
    'Actions dispatched to superstream must be objects with type properties')
})

test('createStore creates a store property', (t) => {
  t.plan(1);
  omnistream.createStore({ testStore$: Rx.Observable.never() });
  t.true(omnistream.hasOwnProperty('store'));
})

test('get history returns a subject', (t) => {
  t.plan(1);
  const omnistream = createOmnistream();
  const history$ = omnistream.getHistory();
  t.true(history$ instanceof Rx.Subject);
})

test('subscription to history$ returns current copy of history array', (t) => {
  t.plan(1);
  const omnistream = createOmnistream();
  const history$ = omnistream.getHistory();
  omnistream.dispatch({ type: 'A' })
  omnistream.dispatch({ type: 'B' })
  const sub0 = history$.subscribe((history) => {
    return t.deepEqual([{ type: 'A' }], history);
  });
  omnistream.dispatch({ type: 'B' })
  // omnistream.dispatch({ type: 'C' })
  
  // // omnistream.dispatch({ type: 'C' })
  // const sub1 = history$.take(1).subscribe((history) => {
  //   console.log('---', history);
  //   return t.deepEqual([{ type: 'A' }, {type: 'B'}, {type: 'C'}], history);
  // })
})


