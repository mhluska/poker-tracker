export type Primitive = string | number | boolean | null | undefined;

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type ElementKeys = Writeable<
  HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
>;

export type EventHandler = (this: HTMLElement, ev: Event) => void;

export type CustomProperties = {
  onInput: EventHandler;
  onClick: EventHandler;
};

export type VirtualElementProps = Partial<ElementKeys & CustomProperties>;

export type VirtualNativeElement = {
  type: keyof HTMLElementTagNameMap;
  props: VirtualElementProps;
  children: (null | VirtualElement)[];
};

export type VirtualFunctionElement<Props = unknown> = {
  type: FunctionComponent<Props>;
  props: VirtualElementProps;
  result: null | VirtualFunctionElement | VirtualNativeElement;
};

export type VirtualStringElement = {
  type: 'String';
  value: string;
};

export type VirtualElement<Props = unknown> =
  | VirtualNativeElement
  | VirtualFunctionElement<Props>
  | VirtualStringElement;

export type FunctionComponent<Props = void> = Props extends void
  ? () => null | VirtualNativeElement | VirtualFunctionElement<void>
  : (
      props: Props
    ) => null | VirtualNativeElement | VirtualFunctionElement<Props>;

export type FC<Props> = FunctionComponent<Props>;

export enum NodeTypes {
  Element = 1,
  Text = 3,
}
