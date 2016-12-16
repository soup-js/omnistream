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

test('subscription to history$ returns y', (t) => {
  t.plan(2);
  const omnistream = createOmnistream();
  const history$ = omnistream.getHistory();
  omnistream.dispatch({ type: 'A' })
  t.deepEqual(omnistream.history, [{type: 'A'}])
  omnistream.dispatch({ type: 'B' })
  t.deepEqual(omnistream.history, [{type: 'A'}, {type: 'B'}])
})

test('history$ does not record actions with _ignore property', (t) => {
  t.plan(1);
  const omnistream = createOmnistream();
  const history$ = omnistream.getHistory();
  omnistream.dispatch({ type: 'A' })
  omnistream.dispatch({ type: 'B', _ignore: true })
  t.deepEqual(omnistream.history, [{type: 'A'}])
})

test('filterForActionTypes only outputs actions according to the parameters passed in', (t) => {
  t.plan(1);
  const omnistream = createOmnistream();
  const filteredStream$ = omnistream.filterForActionTypes('FIRST_ACTION');
  filteredStream$.subscribe((el) =>{
    t.deepEqual({ type: 'FIRST_ACTION' }, el)
  })
  omnistream.dispatch({ type: 'SECOND_ACTION' } )
  omnistream.dispatch({ type: 'FIRST_ACTION' })
})

test('filterForActionTypes takes multiple inputs', (t) => {
  t.plan(1);
  const omnistream = createOmnistream();
  const filteredStream$ = omnistream.filterForActionTypes('FIRST_ACTION', 'SECOND_ACTION');
  const actions = [];
  filteredStream$.subscribe(el => actions.push(el));
  omnistream.dispatch({ type: 'SECOND_ACTION' } )
  omnistream.dispatch({ type: 'FIRST_ACTION' })
  omnistream.dispatch({ type: 'THIRD_ACTION' })
  t.deepEqual(actions, [{ type: 'SECOND_ACTION' },{ type: 'FIRST_ACTION' }])
})

test('filterForActionTypes takes multiple inputs as an array', (t) => {
  t.plan(1);
  const omnistream = createOmnistream();
  const filteredStream$ = omnistream.filterForActionTypes(['FIRST_ACTION', 'SECOND_ACTION']);
  const actions = [];
  filteredStream$.subscribe(el => actions.push(el));
  omnistream.dispatch({ type: 'SECOND_ACTION' } )
  omnistream.dispatch({ type: 'FIRST_ACTION' })
  omnistream.dispatch({ type: 'THIRD_ACTION' })
  t.deepEqual(actions, [{ type: 'SECOND_ACTION' },{ type: 'FIRST_ACTION' }])
})

test('dispatchObservableFn dispatches values from returned observable', (t) => {
  t.plan(1);
  const testObservable = () => Rx.Observable.of({type: 'ACTION'});
  const omnistream = createOmnistream();
  omnistream.stream.subscribe(element => { 
    if (element) t.deepEqual(element, {type: 'ACTION'}) 
  });
  omnistream.dispatchObservableFn(testObservable);
})

