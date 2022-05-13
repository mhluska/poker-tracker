import { e, FunctionComponent } from 'recat-core';

type Props = {
  placeholder?: string;
  id?: string;
  value?: string;
  min?: number;
  max?: number;
  onInput?: (event: Event) => void;
};

export const NumberInput: FunctionComponent<Props> = ({
  id,
  placeholder,
  value,
  min = 1,
  max,
  onInput,
}) =>
  e('input', {
    id,
    type: 'number',
    placeholder,
    pattern: '\\d*',
    value,
    min,
    max,
    required: true,
    onInput,
  });
