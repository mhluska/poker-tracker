import { e } from '../lib/renderer';

type Props = {
  placeholder?: string;
  id?: string;
  value?: string;
  min?: number;
  max?: number;
  onInput?: (event: Event) => void;
};

export const NumberInput = ({ id, placeholder, value, min = 1, max, onInput }: Props) =>
  e('NumberInput', {
    tagName: 'input',
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
