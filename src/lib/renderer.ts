import { Writeable } from '../types';
import { isCapitalized, keys } from '../utils';

type CustomProperties = {
  onInput: NonNullable<GlobalEventHandlers['oninput']>;
};

type EventPropDescription = {
  propName: keyof CustomProperties;
  nativeEventName: string;
  supportedElements: Set<keyof HTMLElementTagNameMap>;
};

type ElementKeys = Writeable<
  HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
>;

type VirtualElementProps = Partial<ElementKeys & CustomProperties>;

// TODO: This can go away once we stop naming components in render functions.
// See https://github.com/mhluska/poker-tracker/issues/9
type CustomElementType =
  | 'IntroScreen'
  | 'NewSessionScreen'
  | 'ShowSessionScreen'
  | 'NumberInput'
  | 'TipsSection'
  | 'BlindsButton'
  | 'App';

type VirtualElement =
  | {
      type: keyof HTMLElementTagNameMap | CustomElementType;
      props: { tagName: keyof HTMLElementTagNameMap } & VirtualElementProps;
      children: VirtualElement[];
    }
  | {
      type: 'String';
      props: { value: string };
      children: [];
    };

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

const isElementNode = (node: Node): node is Element =>
  node.nodeType === NodeTypes.Element;

const isTextNode = (node: Node): node is Text =>
  node.nodeType === NodeTypes.Text;

const createVirtualElementString = (value: string): VirtualElement => ({
  type: 'String',
  props: { value },
  children: [],
});

export const createVirtualElement = (
  type: keyof HTMLElementTagNameMap | CustomElementType,
  props:
    | ({ tagName?: keyof HTMLElementTagNameMap } & VirtualElementProps)
    | null = null,
  ...children: (string | VirtualElement)[]
): VirtualElement => ({
  type,
  props: {
    ...props,
    tagName: props?.tagName || (isNativeElementType(type) ? type : 'div'),
  },
  children: children.map((child) =>
    typeof child === 'string' ? createVirtualElementString(child) : child
  ),
});

export const e = createVirtualElement;

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
    if (
      EVENT_PROPS[propName].supportedElements.has(
        domNode.tagName.toLowerCase() as keyof HTMLElementTagNameMap
      )
    ) {
      domNode.addEventListener(EVENT_PROPS[propName].nativeEventName, newValue);
    } else {
      throw new Error(
        `Added onInput to invalid element type ${domNode.tagName}`
      );
    }
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

const createDomNode = (virtualElement: VirtualElement) => {
  if (virtualElement.type === 'String') {
    return document.createTextNode(virtualElement.props.value);
  }

  const { props, children } = virtualElement;
  const { tagName } = props;
  const element = document.createElement(tagName);

  reconcileProps(element, null, virtualElement);

  for (const child of children) {
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
  prevNode: VirtualElement,
  newNode: VirtualElement
) => {
  if (newNode.type !== 'String') {
    return;
  }

  if (
    prevNode.type === 'String' &&
    prevNode.props.value === newNode.props.value
  ) {
    return;
  }

  if (isElementNode(domNode)) {
    domNode.parentElement?.replaceChild(createDomNode(newNode), domNode);
  } else if (isTextNode(domNode)) {
    domNode.replaceData(0, domNode.length, newNode.props.value);
  }
};

export const reconcile = (
  domNode: Element | Text | undefined,
  prevNode: VirtualElement | undefined,
  newNode: VirtualElement | undefined,
  parentElement: Element | Text
) => {
  if (!domNode) {
    if (newNode) {
      // TODO: This should not append but insert at the correct position in the
      // row of siblings.
      parentElement.appendChild(createDomNode(newNode));
    }
    return;
  }

  if (!newNode) {
    domNode.remove();
    return;
  }

  if (!prevNode || prevNode.type !== newNode.type) {
    parentElement.replaceChild(createDomNode(newNode), domNode);
    return;
  }

  if (newNode.type === 'String') {
    reconcileStrings(domNode, prevNode, newNode);
    return;
  } else if (isTextNode(domNode)) {
    parentElement.replaceChild(createDomNode(newNode), domNode);
    return;
  }

  // We are guaranteed to have domNode, prevNode and newNode here.
  reconcileProps(domNode, prevNode, newNode);

  const domNodeChildren = Array.from(domNode.childNodes).filter(
    (node) =>
      node.nodeType === NodeTypes.Element || node.nodeType === NodeTypes.Text
  ) as (Element | Text)[];

  newNode.children.forEach((newNodeChild, index) => {
    reconcile(
      domNodeChildren[index],
      prevNode.children[index],
      newNodeChild,
      domNode
    );
  });
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

  reconcile(appRoot, prevVirtualElement, virtualElement, appRoot.parentElement);

  prevVirtualElement = virtualElement;
};
