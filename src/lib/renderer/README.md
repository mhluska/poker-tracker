# Renderer

A simple React clone built out of curiosity. Currently missing a lot of features
and probably inefficient. See it live [here](https://poker.mhluska.com).

## Features

- Function components with hooks
- TypeScript support
- No dependencies

## API

### `render(virtualNode, domRoot)`

Updates the `domRoot` contents using the virtual DOM tree at `virtualNode`.
Subsequent render calls will try to make as few writes as possible to the real
DOM tree.

### `createVirtualElement` or `e`

Creates a virtual DOM node. It can be used to render regular DOM elements:

```js
createVirtualElement(tagName, attributes, ...children);
```

To render, pass the virtual node to the `render` function:

```js
render(
  e('div', { className: 'kittens' }, e('h1', null, ' Nora')),
  document.body
);
```

Which renders:

```html
<div class="kittens">
  <h1>Nora</h1>
</div>
```

It can also render function components:

```js
createVirtualElement(functionComponent, props, ...children);
```

```js
const Kitten = ({ name }) => {
  return e(
    'div',
    { className: 'kitten' },
    e('h1', null, name)
  );
};

render(
  e('div', { className: 'kittens' }, e(Kitten, { name: 'Nora' })),
  document.body
);
```

Which renders:

```html
<div class="kittens">
  <div class="kitten">
    <h1>Nora</h1>
  </div>
</div>
```

### Event Handling

Use the `onClick` or `onInput` prop:

```js
const Kitten = ({ name }) => {
  return e(
    'div',
    { className: 'kitten' },
    e('h1', null, name),
    e('button', { onClick: () => console.log(`${name} woke up!`) }, 'Wake up')
  );
};

render(
  e('div', { className: 'kittens' }, e(Kitten, { name: 'Nora' })),
  document.body
);
```

Which renders:

```html
<div class="kittens">
  <div class="kitten">
    <h1>Nora</h1>
    <button>Wake up</button>
  </div>
</div>
```

Pressing the button will print `Nora woke up!` to the console.

### `useState(initialValue)`

Adds local state to the component and provides a setter to update the state.
Calling the setter triggers a rerender of the component subtree:

```js
const Kitten = ({ name }) => {
  const [isAwake, setIsAwake] = useState(false);

  return e(
    'div',
    { className: 'kitten' },
    e('h1', null, name),
    e(
      'button',
      { onClick: () => setIsAwake(true) },
      'Wake up'
    ),
    isAwake &&
      e('span', null, `${name} woke up!`)
  );
};

render(
  e('div', { className: 'kittens' }, e(Kitten, { name: 'Nora' })),
  document.body
);
```

Which renders:

```html
<div class="kittens">
  <div class="kitten">
    <h1>Nora</h1>
    <button>Wake up</button>
  </div>
</div>
```

Pressing the button will update the DOM to:

```html
<div class="kittens">
  <div class="kitten">
    <h1>Nora</h1>
    <button>Wake up</button>
    <span>Nora woke up!</span>
  </div>
</div>
```

### `useEffect(callback, dependencies)`

Calls `callback` whenever the dependencies array changes after the current
component render. Useful for running side effects during render:

```js
const Kitten = ({ name }) => {
  const [isAwake, setIsAwake] = useState(false);

  useEffect(() => {
    console.log(isAwake ? `${name} woke up!` : `${name} is asleep.`);
  }, [isAwake]);

  return e(
    'div',
    { className: 'kitten' },
    e('h1', null, name),
    e(
      'button',
      { onClick: () => setIsAwake(true) },
      'Wake up'
    )
  );
};

render(
  e('div', { className: 'kittens' }, e(Kitten, { name: 'Nora' })),
  document.body
);
```

Which renders:

```html
<div class="kittens">
  <div class="kitten">
    <h1>Nora</h1>
    <button>Wake up</button>
  </div>
</div>
```

On first render, the component prints `Nora is asleep.` to the console.

Pressing the button will print `Nora woke up!` to the console. Future button
presses will not trigger the effect since we added `isAwake` to the dependency
array.
