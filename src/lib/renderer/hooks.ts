import { Primitive, FunctionComponent, VirtualFunctionElement } from './types';
import { arraysEqual, requestIdleCallback } from './utils';

type Effect = {
  callback: () => void;
  unmountCallback: void | (() => void);
  dependencies: Primitive[];
};

type HookData<T> = {
  [key in keyof T]: T[key];
};

type UseStateData = HookData<{ value: unknown }>;

let currentComponent: FunctionComponent<unknown>;
let currentForceRender: () => void;

// TODO: Since hooks should always fire in the same order, we could just push
// all hook data onto a single array with an index that increments per call.
// That way we don't keep in memory other hooks data when we don't need to.
const hooks = {
  useState: new Map<FunctionComponent<unknown>, UseStateData[]>(),
  useEffect: new Map<FunctionComponent<unknown>, HookData<Effect>[]>(),
};

// Calls callback if dependencies change between renders.
export const useEffect = (
  callback: Effect['callback'],
  dependencies: Effect['dependencies']
) => {
  const componentEffects = hooks.useEffect.get(currentComponent) || [];

  componentEffects.push({
    callback,
    dependencies,
    unmountCallback: undefined,
  });

  hooks.useEffect.set(currentComponent, componentEffects);
};

// TODO: This should be a special case of `useReducer` once it's implemented.
export const useState = <T>(initialValue: T): [T, (value: T) => void] => {
  let componentHookData = hooks.useState.get(currentComponent);
  if (!componentHookData) {
    componentHookData = [{ value: initialValue }];
    hooks.useState.set(currentComponent, componentHookData);
  }

  // TODO: Make this work with multiple useState calls.
  const hook = componentHookData[componentHookData.length - 1];

  const setState = (value: T) => {
    if (hook.value !== value) {
      hook.value = value;

      // We could end up here during the current render. That means we'd kick
      // off another render before the DOM has finished updating. So we use
      // `requestIdleCallback` to ensure the next render runs after the current
      // one is complete.
      // TODO: Once fibers are implemented, this can go away.
      requestIdleCallback(currentForceRender);
    }
  };

  // TODO: Can we avoid the cast here? Otherwise value would be `unknown`
  // because of the `hooks.useState` definition above.
  return [hook.value as T, setState];
};

export const mountWithHooks = (
  virtualElement: VirtualFunctionElement,
  forceRender: () => void
) => {
  currentComponent = virtualElement.type;
  currentForceRender = forceRender;

  const prevEffects = hooks.useEffect.get(virtualElement.type);

  // Repopulates after calling the function component below.
  hooks.useEffect.delete(virtualElement.type);

  virtualElement.result = virtualElement.type(virtualElement.props);

  const currentUseEffectCalls = hooks.useEffect.get(currentComponent);

  if (!currentUseEffectCalls || currentUseEffectCalls.length === 0) {
    return virtualElement.result;
  }

  currentUseEffectCalls.forEach((nextEffect, index) => {
    const prevEffect = prevEffects?.[index];

    if (
      prevEffect &&
      arraysEqual(prevEffect.dependencies, nextEffect.dependencies)
    ) {
      nextEffect.unmountCallback = prevEffect.unmountCallback;
    } else {
      nextEffect.unmountCallback = nextEffect.callback();
    }
  });

  return virtualElement.result;
};

export const unmountWithHooks = (virtualElement: VirtualFunctionElement) => {
  const componentEffects = hooks.useEffect.get(virtualElement.type);
  if (!componentEffects) {
    return virtualElement.result;
  }

  for (const { unmountCallback } of componentEffects) {
    if (unmountCallback) {
      unmountCallback();
    }
  }

  hooks.useEffect.delete(virtualElement.type);
  hooks.useState.delete(virtualElement.type);

  return virtualElement.result;
};
