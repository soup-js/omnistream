# Omnistream
### Omnistream is a stream-based state management library for React built on RxJs observables.

Omnistream has a simple API that allows React components to selectively subscribe to portions of a central store. This avoids unnecessary re-renders without the need of `componentShouldUpdate` or other workarounds. Upon connecting, your components will always stay up to date with the store and re-render as needed. With this model, it's possible to work exclusively with stateless functional components, creating a more reactive application structure. Omnistream also features a built-in time-travelling debugger that operates without keeping any copies of the application state (since in Omnistream, the store is a stream of actions). 

In the spirit of [redux-observable](https://github.com/redux-observable/redux-observable), Omnistream is built around the idea of dispatching observables to your store. This allows you to compose some complicated async logic fairly easily.  

## Disclaimer

Omnistream is in early stages of development and all features are currently experimental. We would appreciate hearing about any issues you encounter or feature requests. Feel free to open issues or submit pull requests. 

## Getting Started
----

`npm install --save omnistream`

### Create a central store 

The central store is called the omnistream. After creating it and adding state streams, wrap your components in the provided StreamProvider component to give them access to it.

``` javascript

import React from 'react'
import ReactDOM from 'react-dom'
import { createOmnistream, StreamProvider } from 'Omnistream'
import { loginAction } from './actionStreams'; // import action stream creator
import { loginReducer } from './reducers';

const omnistream = createOmnistream();
const loginState$ = omnistream.createStatestream(loginReducer, loginAction); // create a state stream
omnistream.createStore({ loginState$ });

ReactDOM.render(
  // wrap components in StreamProvider to give them access to the omnistream
  <StreamProvider omnistream={omnistream}> // pass the omnistream instance to the StreamProvider
    <App />
  </StreamProvider>,
  document.getElementById('root')
);
```

### Creating a collection of state streams

Omnistream stores state in a collection of "state streams." This is a simple object with keys representing different streams. Each of these streams emit objects which hold the current state for its subscriptions. With each new relevant action, a reducer will reduce a new copy of state, and this new copy will be pushed to subscribers.

To set up state streams, there are three steps: 

1. Write reducers

2. Call `omnistream.createStatestream` with a reducer and optional function to create a custom action stream

3. Combine state streams into the omnistream store

If the second argument to `createStatestream` is not provided, the resulting state stream will send all dispatched actions to its reducer. We recommend filtering the omnistream to only the relevant actions required by the reducer. This can be done with the `omnistream.filterForActionTypes` method, which takes an array of action types (or multiple parameters specifying the action types), and returns a filtered action stream according to those actions. To use the second argument to `createStatestream`, provide a function that takes the omnistream as an argument and applies the `filterForActionTypes` method.

Once state streams have been created, they can be added to the omnistream's store with the `omnistream.createStore` method. Note that this method overwrites the current store if it exists. To instead add a state stream to the store after it has been created, use `omnistream.addToStore`. 


Creating an action stream and state stream:

```javascript
const omnistream = omnistream.createOmnistream();
const loginAction = (omnisteam) => omnistream.filterForActionTypes('USER_LOGIN'); // creates login action stream
const loginState$ = omnistream.createStatestream(loginReducer, loginAction); //  creates login state stream
omnistream.createStore({ loginState$, ...otherStates$ });
```

### Connecting a component

To connect a component to the omnistream, wrap your component in a call to the provided `reactiveComponent` method, along with strings specifying the specific streams you'd like to subscribe to.

```javascript
function User(props) {
  // destructure the props received from stream subscriptions
  const {username, url} = props;
  return (
    <div>
      <p> {username} </p>
      <img src={url} />
    </div>
  )
}
export default reactiveComponent(User, 'loginState$');
```

In the above example, the component will be subscribed to `loginState$`, and all new copies of that state will be pushed to the component in its props.

### Dispatching actions

Omnistream provides a `dispatch` method to all Reactive Components as part of their props. To dispatch an action, simply call dispatch with an object containing a `type` property.

```javascript
function User(props) {
  const {username, url} = props;
  return (
    <div>
      <input type=text onSubmit={(e) => dispatch({data: e.target.value, type: 'USER_NAME'})} />
      <p> {username} </p>
      <img src={url} />
    </div>
  )
}

export default reactiveComponent(User, 'loginState$');
```

Here, an action of the form `{data: e.target.value, type: 'USER_NAME'}` is dispatched. When this action is dispatched, it is merged into the omnistream. Any updates from the `loginState$` will be pushed to this component in the form of props.

### Dispatching observables

Omnistream also provides `omnistream.dispatchObservableFn` as a method to dispatch observables instead of simple actions. The observables can then emit their own streams of actions, which will be folded into the omnistream in the correct order. This allows one to design complex asynchronous action sequences. Furthermore, every dispatched observable will have access to `omnistream`, so you can create observables that interact with actions dispatched from separate parts of the app.

`dispatchObservableFn` takes one argument, which should be a function that returns an observable. The observable function you provide will be passed the omnistream's action stream as its first parameter.

```javascript
const timeUntilLogin = (omnistream) => (
  const login = omnistream.filter(action => action.type === 'USER_LOGIN');
  return Rx.Observable.interval(100)
    .scan((acc, curr) => acc + 100, 0)
    .map(ms => ({type: 'TIME_TO_LOGIN', ms}))
    .takeUntil(login);
)

class User extends Component() {
  componentDidMount() {
    this.dispatchObservableFn(timeUntilLogin);
  }

  render() {
    return (
      <div>
        <input type=text onSubmit={(e) => dispatch({data: e.target.value, type: 'USER_NAME'})} />
        <p> {username} </p>
        <img src={url} />
      </div>
    )
  }
}

export default reactiveComponent(User, 'loginState$');
```

In this example, an observable is dispatched which will record the time up until a login action is sent. This is possible because `omnistream` is passed in as the first argument to the `timeUntilLogin` function. When the component mounts, it dispatches this function to the omnistream which evaluates it and folds in all resulting actions.


### Adding the timeline 

Adding the timeline debugger is simply a matter of including the provided `Timeline` component in your app, along with the omnistream as a prop. 

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { createOmnistream, StreamProvider } from 'Omnistream'
import {loginAction} from './actionStreams';

const omnistream = createOmnistream();
const loginState$ = omnistream.createStatestream(barPositionReducer, loginAction); 
omnistream.createStore({ loginState$ }); // create the store

ReactDOM.render(
  <div>
    <StreamProvider omnistream={omnistream}>
      <App />
    </StreamProvider>
    // add the timeline component with omnistream as a prop
    <Timeline omnistream={omnistream} />
  </div>,
  document.getElementById('root')
);
```

When your app is rendered, it will now include a timeline with a visualization of every action in your app. Clicking on the slider will enable time travel, and dragging it to different actions will revert the app to that particular point. Side effects are ignored during time travel, so you don't need to worry about `componentDidMount` AJAX calls or similar events polluting the timeline. 

Double clicking on any  action displayed in the timeline will revert the app to it's state upon receiving that action, and hovering over any action will display its actual javascript object representation.

![timetravel](https://cloud.githubusercontent.com/assets/14319917/21365906/4f9f49bc-c6ac-11e6-915e-b076265523a9.gif)
