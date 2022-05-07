import {
  FunctionComponent,
  ElementKeys,
  CustomProperties,
  VirtualStringElement,
  VirtualElement,
  VirtualFunctionElement,
  VirtualElementProps,
  VirtualNativeElement,
  EventHandler,
  NodeTypes,
} from './types';
import {
  keys,
  isVirtualFunctionElement,
  isVirtualNativeElement,
  isTextNode,
  isElementNode,
  replaceNode,
} from './utils';
import { mountWithEffects, unmountWithEffects } from './hooks';

enum ElementProperties {
  Value = 'value',
  ClassName = 'className',
}

const ELEMENT_PROPERTIES = new Set<Partial<ElementKeys>>(
  Object.values(ElementProperties)
);

const EVENT_PROPS: Map<keyof CustomProperties, keyof HTMLElementEventMap> =
  new Map([
    ['onInput', 'input'],
    ['onClick', 'click'],
  ]);

const createVirtualElementString = (value: string): VirtualStringElement => ({
  type: 'String',
  value,
});

export function createVirtualElement<Props, ChildProps>(
  type: FunctionComponent<Props>,
  props?: Props,
  ...children: (null | string | VirtualElement<ChildProps>)[]
): VirtualFunctionElement<Props>;

export function createVirtualElement<ChildProps>(
  type: keyof HTMLElementTagNameMap,
  props?: VirtualElementProps | null,
  ...children: (null | string | VirtualElement<ChildProps>)[]
): VirtualNativeElement;

export function createVirtualElement<Props, ChildProps>(
  type: FunctionComponent<Props> | keyof HTMLElementTagNameMap,
  props?: Props | VirtualElementProps | null,
  ...children: (null | string | VirtualElement<ChildProps>)[]
) {
  return typeof type === 'function'
    ? ({
        type,
        props: props || {},
        result: null,
      } as VirtualFunctionElement<Props>)
    : ({
        type,
        props: {
          ...props,
          tagName: type || 'div',
        },
        children: children.map((child) =>
          typeof child === 'string' ? createVirtualElementString(child) : child
        ),
      } as VirtualNativeElement);
}

export const e = createVirtualElement;

const reconcileEventHandlerProps = (
  domNode: Element,
  nativeEventName: string,
  prevValue: EventHandler | undefined,
  newValue: EventHandler | undefined
) => {
  if (prevValue === newValue) {
    return;
  }

  if (prevValue) {
    domNode.removeEventListener(nativeEventName, prevValue);
  }

  if (newValue) {
    domNode.addEventListener(nativeEventName, newValue);
  }
};

const reconcileProps = (
  domNode: Element,
  prevNode: VirtualElement | null,
  newNode: VirtualElement | null
) => {
  if (prevNode?.type === 'String' || newNode?.type === 'String') {
    return;
  }

  const prevPropKeys = prevNode ? keys(prevNode.props) : [];
  const newPropKeys = newNode ? keys(newNode.props) : [];

  for (const name of newPropKeys.concat(prevPropKeys)) {
    const prevValue = prevNode?.props[name];
    const newValue = newNode?.props[name];

    // HACK: With properties (as opposed to attributes), our crappy virtal DOM
    // can get out of sync after user input so we just always write.
    if (ELEMENT_PROPERTIES.has(name)) {
      // TODO: Fix type `Element` being too generic here.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      domNode[name] = newValue === undefined ? '' : newValue;
      continue;
    }

    if (prevValue === newValue) {
      continue;
    }

    if (name === 'onClick' || name === 'onInput') {
      const nativeEventName = EVENT_PROPS.get(name);

      if (nativeEventName) {
        reconcileEventHandlerProps(
          domNode,
          nativeEventName,
          prevNode?.props[name],
          newNode?.props[name]
        );
      }

      continue;
    }

    if (typeof newValue === 'boolean') {
      if (newValue) {
        domNode.setAttribute(name, '');
      } else {
        domNode.removeAttribute(name);
      }
    } else if (typeof newValue === 'undefined') {
      domNode.removeAttribute(name);
    } else {
      domNode.setAttribute(name, String(newValue));
    }
  }
};

const createDomNode = (
  virtualElement: VirtualElement | null
): Text | HTMLElement | null => {
  if (!virtualElement) {
    return null;
  }

  if (virtualElement.type === 'String') {
    return document.createTextNode(virtualElement.value);
  }

  if (isVirtualFunctionElement(virtualElement)) {
    return createDomNode(mountWithEffects(virtualElement));
  }

  const { children, type: tagName } = virtualElement;
  const element = document.createElement(tagName);

  reconcileProps(element, null, virtualElement);

  for (const child of children) {
    if (!child) {
      continue;
    }

    const childDomElement = createDomNode(child);

    if (!childDomElement) {
      continue;
    }

    element.appendChild(childDomElement);
  }

  return element;
};

const reconcileStrings = (
  domNode: Element | Text,
  prevNode: VirtualStringElement,
  newNode: VirtualStringElement
) => {
  if (prevNode.value === newNode.value) {
    return;
  }

  if (isElementNode(domNode)) {
    replaceNode(domNode, createDomNode(newNode));
  } else if (isTextNode(domNode)) {
    domNode.replaceData(0, domNode.length, newNode.value);
  }
};

export const reconcile = (
  domNode: Element | Text,
  prevNode: VirtualElement | undefined | null,
  newNode: VirtualElement | undefined | null
) => {
  if (!newNode) {
    domNode.remove();
    return;
  }

  if (!prevNode || prevNode.type !== newNode.type) {
    if (prevNode && isVirtualFunctionElement(prevNode)) {
      unmountWithEffects(prevNode);
    }

    replaceNode(domNode, createDomNode(newNode));
    return;
  }

  // We needlessly have to repeatedly check the type of `prevNode` here even
  // though we ensure that both types are the same above.
  // See https://stackoverflow.com/questions/71397541
  if (prevNode.type === 'String' && newNode.type === 'String') {
    reconcileStrings(domNode, prevNode, newNode);
    return;
  }

  if (isTextNode(domNode)) {
    replaceNode(domNode, createDomNode(newNode));
    return;
  }

  if (isVirtualFunctionElement(prevNode) && isVirtualFunctionElement(newNode)) {
    reconcile(
      domNode,
      prevNode.result,
      mountWithEffects(newNode)
    );
    return;
  }

  if (isVirtualNativeElement(prevNode) && isVirtualNativeElement(newNode)) {
    reconcileProps(domNode, prevNode, newNode);

    const domNodeChildren = Array.from(domNode.childNodes).filter(
      (node) =>
        node.nodeType === NodeTypes.Element || node.nodeType === NodeTypes.Text
    ) as (Element | Text)[];

    newNode.children.forEach((newNodeChild, index) => {
      const domNodeChild = domNodeChildren[index];

      if (domNodeChild) {
        reconcile(domNodeChild, prevNode.children[index], newNodeChild);
      } else if (newNodeChild) {
        const node = createDomNode(newNodeChild);
        if (node) {
          domNode.appendChild(node);
        }
      }
    });
  }
};

// This should mimic the real appRoot node.
let prevVirtualElement: VirtualElement = createVirtualElement('div');

export const render = (
  component: VirtualNativeElement | VirtualFunctionElement | null,
  appRoot: HTMLElement | null
) => {
  if (!component) {
    throw new Error('component is null');
  }

  if (!appRoot) {
    throw new Error('appRoot is not set');
  }

  if (!appRoot.parentElement) {
    throw new Error('appRoot not attached to DOM');
  }

  const virtualElement = createVirtualElement('div', null, component);

  reconcile(appRoot, prevVirtualElement, virtualElement);

  prevVirtualElement = virtualElement;
};
