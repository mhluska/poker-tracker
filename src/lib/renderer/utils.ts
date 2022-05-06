import {
  Primitive,
  VirtualElement,
  VirtualFunctionElement,
  VirtualStringElement,
  VirtualNativeElement,
  NodeTypes
} from './types';

// See https://github.com/microsoft/TypeScript/pull/12253#issuecomment-353494273
export const keys = Object.keys as <T>(o: T) => (keyof T)[];

export const isVirtualFunctionElement = (
  virtualElement: VirtualElement
): virtualElement is VirtualFunctionElement =>
  typeof virtualElement.type === 'function';

export const isVirtualStringElement = (
  virtualElement: VirtualElement
): virtualElement is VirtualStringElement => virtualElement.type === 'String';

export const isVirtualNativeElement = (
  virtualElement: VirtualElement
): virtualElement is VirtualNativeElement =>
  !isVirtualStringElement(virtualElement) &&
  !isVirtualFunctionElement(virtualElement);

export const isElementNode = (node: Node): node is Element =>
  node.nodeType === NodeTypes.Element;

export const isTextNode = (node: Node): node is Text =>
  node.nodeType === NodeTypes.Text;

export const replaceNode = (
  node: Text | Element,
  newNode: Text | HTMLElement | null
) => {
  if (!newNode) {
    return;
  }

  node.parentElement?.replaceChild(newNode, node);
};

export const arraysEqual = (arr1: Primitive[], arr2: Primitive[]) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i += 1) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
};
