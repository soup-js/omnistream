# Soup-js
### Soup-js is a stream-based state management library for React built on RxJs observables.

Soup-js has a simple API that allows React components to selectively subscribe to portions of a central store. This avoids unnecessary re-renders without the need of `componentShouldUpdate` or other workarounds. Upon connecting, your components will always stay up to date with the store and re-render as needed. With this model, it's possible to rely nearly exclusively on stateless functional React components, creating a more reactive application structure. Soup-js also features a built-in time-travelling debugger that operates without keeping any copies of the application state (since in soup-js, the store is a stream of actions).

## Disclaimer
Disclaimer

Soup-js is in early stages of development and all features are currently experimental. We would appreciate hearing about any issues you encounter or feature requests.

## Getting Started
----

`npm install --save soup-js`

### Create a central store 

The central store is called the superstream. After creating it, wrap your components in the provided StreamProvider component to give them access to it.

``` 
import React from 'react'
import ReactDOM from 'react-dom'
import { createSuperstream, StreamProvider } from 'soup-js'

// create a central store, or "superstream", which will hold state
const superstream = createSuperstream();

ReactDOM.render(
  // wrap components in StreamProvider to give them access to the superstream
  <StreamProvider superstream={superstream}> // pass the superstream instance to the StreamProvider
    <App />
  </StreamProvider>,
  document.getElementById('root')
);
```

### Connecting a component

To connect a component to the superstream, wrap your component in a call to the provided `reactiveComponent` method, along with the specific data you'd like to subscribe to.

```
function User(props) {
  // destructure the props and rename if needed
  const {USER_NAME: username, IMAGE_URL: url} = props;
  return (
    <div>
      <p> {username} </p>
      <img src={url} />
    </div>
  )
}
export default reactiveComponent(User, 'USER_NAME', 'IMAGE_URL');
```

In the above example, the component will be subscribed to all actions with the type 'USER_NAME' and 'IMAGE_URL', and will update whenever new actions of these types are produced.

### Dispatching actions

Now that our component is connected, how do we dispatch actions to the superstream? Soup-js provides a `dispatch` method to all Reactive Components as part of their props. To dispatch an action, simply call dispatch with an object of the form `{ data: ..., type: STRING }`.

```
function User(props) {
  const {USER_NAME: username, IMAGE_URL: url, dispatch} = props;
  return (
    <div>
      // call dispatch with an action object
      <input type=text onSubmit={(e) => dispatch({data: e.target.value, type: 'USER_NAME'})} />
      <p> {username} </p>
      <img src={url} />
    </div>
  )
}

export default reactiveComponent(User, 'USER_NAME', 'IMAGE_URL');
```

Here, the an action of the form `{data: e.target.value, type: 'USER_NAME'}` is dispatched to the superstream. When this action is dispatched, it is merged into the superstream. Because this component is also subscribed to the 'USER_NAME' stream, it will receive the new data as a prop under the `USER_NAME` property and update accordingly. 


### Adding the timeline 

Adding the timeline debugger is simply a mattter of including the provided `Timeline` component in your app, along with the superstream as a prop. 


``` 
import React from 'react'
import ReactDOM from 'react-dom'
import { createSuperstream, StreamProvider } from 'soup-js'

const superstream = createSuperstream();

ReactDOM.render(
  <div>
    <StreamProvider superstream={superstream}>
      <App />
    </StreamProvider>
    // add the timeline component with superstream as a prop
    <Timeline superstream={superstream} />
  </div>,
  document.getElementById('root')
);
```

When your app is rendered, it will now include a debugging pane with a visualization of every action in your app. By dragging the slider across the timeline or double clicking specific actions, the app will rewind or transform to that particular point in time. 
