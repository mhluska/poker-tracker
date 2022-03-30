import { ElementProperties } from '../types';
import { isCapitalized, keys } from '../utils';

const ELEMENT_NODE_TYPE = 1;
const TEXT_NODE_TYPE = 3;
const ELEMENT_PROPERTIES = new Set(['value', 'className']);

type VirtualElement = {
  type: string;
  tagName: keyof HTMLElementTagNameMap;
  props: Partial<ElementProperties>;
  children: VirtualNode[];
};

type VirtualNode = string | VirtualElement;

const isNativeElementType = (
  type: string
): type is keyof HTMLElementTagNameMap => !isCapitalized(type);

const elementType = (element: NonNullable<VirtualNode>) => {
  return typeof element === 'string' ? 'string' : element.type;
};

export const createVirtualElement = (
  type: string,
  props: VirtualElement['props'] | null = null,
  ...children: VirtualElement['children']
): VirtualElement => ({
  type,
  tagName: isNativeElementType(type)
    ? type
    : (props?.tagName as keyof HTMLElementTagNameMap),
  props: props || {},
  children,
});

export const e = createVirtualElement;

export const createDomNode = (virtualNode: VirtualNode) => {
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode);
  }

  const { tagName, props, children } = virtualNode;
  const element = document.createElement(tagName);

  if (props) {
    for (const name of keys(props)) {
      if (name === 'tagName') {
        continue;
      }

      const value = props[name];

      if (ELEMENT_PROPERTIES.has(name)) {
        // TODO: Figure out why an error related to readonly properties is
        // happening despite using `Writeable`.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        element[name] = value;
      } else {
        if (typeof value === 'boolean') {
          if (value) {
            element.setAttribute(name, '');
          }
        } else {
          element.setAttribute(name, String(value));
        }
      }
    }
  }

  for (const child of children) {
    const childDomElement = createDomNode(child);

    if (!childDomElement) {
      continue;
    }

    element.appendChild(childDomElement);
  }

  return element;
};

export const reconcileProps = (
  domNode: Element,
  prevNode: VirtualElement,
  newNode: VirtualElement
) => {
  for (const name of keys(newNode.props)) {
    // HACK: With properties, our crappy virtal DOM can get out of sync after
    // user input so we just always write.
    if (ELEMENT_PROPERTIES.has(name) && newNode.props[name] !== undefined) {
      // TODO: Fix type `Element` being too generic here.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      domNode[name] = newNode.props[name];
    } else if (newNode.props[name] !== prevNode.props[name]) {
      if (typeof newNode.props[name] === 'boolean') {
        if (newNode.props[name]) {
          domNode.setAttribute(name, '');
        } else {
          domNode.removeAttribute(name);
        }
      } else {
        domNode.setAttribute(name, String(newNode.props[name]));
      }
    }
  }

  for (const name of keys(prevNode.props)) {
    if (newNode.props[name] === undefined) {
      if (ELEMENT_PROPERTIES.has(name)) {
        // TODO: Fix type `Element` being too generic here.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        domNode[name] = '';
      } else {
        domNode.removeAttribute(name);
      }
    }
  }
};

export const reconcile = (
  domNode: Element | null,
  prevNode: VirtualNode,
  newNode: VirtualNode,
  parentElement: Element
) => {
  if (!domNode) {
    parentElement.appendChild(createDomNode(newNode));
    return;
  }

  if (prevNode && newNode) {
    if (elementType(prevNode) !== elementType(newNode)) {
      domNode.parentElement?.replaceChild(createDomNode(newNode), domNode);
      return;
    }

    if (typeof prevNode === 'string') {
      domNode.parentElement?.replaceChild(createDomNode(newNode), domNode);
      return;
    }

    // This is certain because we check that both types are the same above but
    // TypeScript is not smart enough to know that.
    if (typeof newNode === 'string') {
      return;
    }

    reconcileProps(domNode, prevNode, newNode);

    newNode.children.forEach((newNodeChild, index) => {
      reconcile(
        Array.from(domNode.childNodes).filter(
          (node) =>
            node.nodeType === ELEMENT_NODE_TYPE ||
            node.nodeType === TEXT_NODE_TYPE
        )[index] as Element,
        prevNode.children[index],
        newNodeChild,
        domNode
      );
    });
  } else if (newNode) {
    domNode.parentElement?.replaceChild(createDomNode(newNode), domNode);
  } else if (prevNode) {
    domNode.remove();
  }
};

let prevVirtualNode = e('div');

export const render = (
  component: VirtualNode,
  appRoot: HTMLElement | null
) => {
  if (!appRoot) {
    throw new Error('appRoot is not set');
  }

  if (!appRoot.parentElement) {
    throw new Error('appRoot not attached to DOM');
  }

  const virtualNode = e('div', null, component);
  reconcile(appRoot, prevVirtualNode, virtualNode, appRoot.parentElement);

  prevVirtualNode = virtualNode;
};
