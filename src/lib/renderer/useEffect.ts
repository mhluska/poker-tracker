import { Primitive, FunctionComponent, VirtualFunctionElement } from './types';
import { arraysEqual } from './utils';

type Effect = {
  callback: () => void;
  unmountCallback: void | (() => void);
  dependencies: Primitive[];
};

const effects = new Map<FunctionComponent<unknown>, Effect[]>();
let currentRenderEffects: Effect[] = [];

// Calls callback if dependencies change between renders.
export const useEffect = (
  callback: Effect['callback'],
  dependencies: Effect['dependencies']
) => {
  currentRenderEffects.push({
    callback,
    dependencies,
    unmountCallback: undefined,
  });
};

export const mountWithEffects = (virtualElement: VirtualFunctionElement) => {
  const prevEffects = effects.get(virtualElement.type);

  // Populates after calling the function component below.
  currentRenderEffects = [];

  virtualElement.result = virtualElement.type(virtualElement.props);

  if (currentRenderEffects.length === 0) {
    return virtualElement.result;
  }

  currentRenderEffects.forEach((nextEffect, index) => {
    const prevEffect = prevEffects?.[index];

    if (prevEffect && arraysEqual(prevEffect.dependencies, nextEffect.dependencies)) {
      nextEffect.unmountCallback = prevEffect.unmountCallback;
    } else {
      nextEffect.unmountCallback = nextEffect.callback();
    }
  });

  effects.set(virtualElement.type, currentRenderEffects);

  return virtualElement.result;
};

export const unmountWithEffects = (virtualElement: VirtualFunctionElement) => {
  const componentEffects = effects.get(virtualElement.type);
  if (!componentEffects) {
    return virtualElement.result;
  }

  for (const { unmountCallback } of componentEffects) {
    if (unmountCallback) {
      unmountCallback();
    }
  }

  effects.delete(virtualElement.type);

  return virtualElement.result;
}
