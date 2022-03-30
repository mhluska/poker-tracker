import { e } from '../lib/renderer';

type Props = {
  id: string;
  placeholder: string;
  value?: string;
  min?: number;
  max?: number;
};

export const NumberInput = ({ id, placeholder, value, min = 1, max }: Props) =>
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
  });
