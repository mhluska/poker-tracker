import { ElementProperties } from '../types';
import { isCapitalized, keys } from '../utils';

type CustomProperties = {
  onInput: NonNullable<GlobalEventHandlers['oninput']>;
};

type EventPropDescription = {
  propName: keyof CustomProperties;
  nativeEventName: string;
  supportedElements: Set<keyof HTMLElementTagNameMap>;
};

type VirtualElementProps = Partial<ElementProperties & CustomProperties>;

type VirtualElement = {
  type: Capitalize<string> | keyof HTMLElementTagNameMap;
  props: { tagName: keyof HTMLElementTagNameMap } & VirtualElementProps;
  children: VirtualNode[];
};

type VirtualNode = string | VirtualElement;

const ELEMENT_NODE_TYPE = 1;
const TEXT_NODE_TYPE = 3;
const ELEMENT_PROPERTIES = new Set(['value', 'className']);
const EVENT_PROPS: Record<string, EventPropDescription> = {
  onInput: {
    propName: 'onInput',
    nativeEventName: 'input',
    supportedElements: new Set(['input', 'select', 'textarea']),
  },
};

const isNativeElementType = (
  type: string
): type is keyof HTMLElementTagNameMap => !isCapitalized(type);

const elementType = (element: NonNullable<VirtualNode>) => {
  return typeof element === 'string' ? 'string' : element.type;
};

export const createVirtualElement = (
  type: VirtualElement['type'],
  props:
    | ({ tagName?: keyof HTMLElementTagNameMap } & VirtualElementProps)
    | null = null,
  ...children: VirtualElement['children']
): VirtualElement => ({
  type,
  props: {
    ...props,
    tagName: props?.tagName || (isNativeElementType(type) ? type : 'div'),
  },
  children,
});

export const e = createVirtualElement;

export const createDomNode = (virtualNode: VirtualNode) => {
  if (typeof virtualNode === 'string') {
    return document.createTextNode(virtualNode);
  }

  const { props, children } = virtualNode;
  const { tagName } = props;
  const element = document.createElement(tagName);

  if (props) {
    for (const name of keys(props)) {
      if (name === 'tagName') {
        continue;
      }

      const value = props[name];

      if (EVENT_PROPS[name]) {
        if (EVENT_PROPS[name].supportedElements.has(tagName)) {
          // TODO: Can we avoid a typecast here?
          element.addEventListener(
            EVENT_PROPS[name].nativeEventName,
            value as EventListener
          );
          continue;
        } else {
          throw new Error(`Added onInput to invalid element type ${tagName}`);
        }
      }

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

const reconcileEventHandlerProps = (
  domNode: Element,
  propName: keyof CustomProperties,
  prevValue?: EventListener,
  newValue?: EventListener
) => {
  if (prevValue) {
    domNode.removeEventListener(
      EVENT_PROPS[propName].nativeEventName,
      prevValue
    );
  }

  if (newValue) {
    domNode.addEventListener(EVENT_PROPS[propName].nativeEventName, newValue);
  }
};

export const reconcileProps = (
  domNode: Element,
  prevNode: VirtualElement,
  newNode: VirtualElement
) => {
  for (const name of keys(newNode.props).concat(keys(prevNode.props))) {
    const prevValue = prevNode.props[name];
    const newValue = newNode.props[name];

    // HACK: With properties, our crappy virtal DOM can get out of sync after
    // user input so we just always write.
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

    if (EVENT_PROPS[name]) {
      // TODO: Can we avoid a typecast here?
      reconcileEventHandlerProps(
        domNode,
        EVENT_PROPS[name].propName,
        prevValue as EventListener | undefined,
        newValue as EventListener | undefined
      );
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

export const render = (component: VirtualNode, appRoot: HTMLElement | null) => {
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
