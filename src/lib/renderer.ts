import { Writeable } from '../types';
import { keys } from '../utils';

type EventHandler = (this: HTMLElement, ev: Event) => void;

type CustomProperties = {
  onInput: EventHandler;
  onClick: EventHandler;
};

type ElementKeys = Writeable<
  HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
>;

type VirtualElementProps = Partial<ElementKeys & CustomProperties>;

type VirtualNativeElement = {
  type: keyof HTMLElementTagNameMap;
  props: VirtualElementProps;
  children: (null | VirtualElement)[];
};

type VirtualFunctionElement<Props = unknown> = {
  type: FunctionComponent<Props>;
  props: VirtualElementProps;
  children: [];
};

type VirtualStringElement = {
  type: 'String';
  props: { value: string };
  children: [];
};

type VirtualElement<Props = unknown> =
  | VirtualNativeElement
  | VirtualFunctionElement<Props>
  | VirtualStringElement;

export type FunctionComponent<Props = void> = Props extends void
  ? () => null | VirtualNativeElement
  : (props: Props) => null | VirtualNativeElement;

export type FC<Props> = FunctionComponent<Props>;

enum NodeTypes {
  Element = 1,
  Text = 3,
}

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

const isElementNode = (node: Node): node is Element =>
  node.nodeType === NodeTypes.Element;

const isTextNode = (node: Node): node is Text =>
  node.nodeType === NodeTypes.Text;

const isVirtualFunctionElement = (
  virtualElement: VirtualElement
): virtualElement is VirtualFunctionElement =>
  typeof virtualElement.type === 'function';

const isVirtualStringElement = (
  virtualElement: VirtualElement
): virtualElement is VirtualStringElement => virtualElement.type === 'String';

const isVirtualNativeElement = (
  virtualElement: VirtualElement
): virtualElement is VirtualNativeElement =>
  !isVirtualStringElement(virtualElement) &&
  !isVirtualFunctionElement(virtualElement);

const createVirtualElementString = (value: string): VirtualElement => ({
  type: 'String',
  props: { value },
  children: [],
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
  props: Props | VirtualElementProps | null,
  ...children: (null | string | VirtualElement<ChildProps>)[]
) {
  return typeof type === 'function'
    ? {
        type,
        props: props || {},
        children: [],
      }
    : {
        type,
        props: {
          ...props,
          tagName: type || 'div',
        },
        children: children.map((child) =>
          typeof child === 'string' ? createVirtualElementString(child) : child
        ),
      }
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
    return document.createTextNode(virtualElement.props.value);
  }

  if (isVirtualFunctionElement(virtualElement)) {
    return createDomNode(virtualElement.type(virtualElement.props));
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

const replaceNode = (
  node: Text | Element,
  newNode: Text | HTMLElement | null
) => {
  if (!newNode) {
    return;
  }

  node.parentElement?.replaceChild(newNode, node);
};

const reconcileStrings = (
  domNode: Element | Text,
  prevNode: VirtualStringElement,
  newNode: VirtualStringElement
) => {
  if (prevNode.props.value === newNode.props.value) {
    return;
  }

  if (isElementNode(domNode)) {
    replaceNode(domNode, createDomNode(newNode));
  } else if (isTextNode(domNode)) {
    domNode.replaceData(0, domNode.length, newNode.props.value);
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
      prevNode.type(prevNode.props),
      newNode.type(newNode.props)
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
let prevVirtualElement = createVirtualElement('div');

export const render = (
  component: VirtualElement | null,
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
