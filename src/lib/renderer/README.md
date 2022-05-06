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
Subsequent render calls try to make as few writes as possible to the real DOM
tree.

### `createVirtualElement` or `e`

Creates a virtual DOM node. It can be used to render regular DOM elements:

```js
createVirtualElement(tagName, attributes, ...children)
```

```js
render(
  e('div', { className: 'kittens' },
    e('h1', null, 'A kitten named Nora')
  ),
  document.body
)
```

Which renders:

```html
<div class="kittens">
  <h1>A kitten named Nora</h1>
</div>
```

It can also render function components:

```js
createVirtualElement(functionComponent, props, ...children)
```

```js
const Kitten = ({ name }) => {
  return e('div', { className: 'kitten' },
    e('h1', null, `A kitten named ${name}`)
  );
};

render(
  e('div', { className: 'kittens' },
    e(Kitten, { name: 'Nora' })
  ),
  document.body
)
```

Which renders:

```html
<div class="kittens">
  <div class="kitten">
    <h1>A kitten named Nora</h1>
  </button>
</div>
```

### `useEffect(callback, dependencies)`

Calls `callback` whenever the dependencies array changes after the last
component render:

```js
const Kitten = ({ name }) => {
  useEffect(() => console.log('Name changed!', name), [name]);

  return e('div', { className: 'kitten' },
    e('h1', null, `A kitten named ${name}`)
  );
};

render(e(Kitten, { name: 'Nora' }), document.body);
render(e(Kitten, { name: 'Nora' }), document.body);
render(e(Kitten, { name: 'Max' }), document.body);
```

This would only print two logs to the console:

```
Name changed! Nora
Name changed! Max
```

### Event Handling

Use the `onClick` or `onInput` prop:

```js
const Kitten = ({ name }) => {
  return e('div', { className: 'kitten' },
    e('h1', null, `A kitten named ${name}`),
    e('button', { onClick: () => console.log('Meow!') }, 'Meow')
  );
};

render(
  e('div', { className: 'kittens' },
    e(Kitten, { name: 'Nora' })
  ),
  document.body
)
```

Which renders:

```html
<div class="kittens">
  <div class="kitten">
    <h1>A kitten named Nora</h1>
    <button>Meow</button>
  </button>
</div>
```

Pressing the button will print `Meow!` to the console.

### `useState(initialValue)`

This is not implemented yet.
