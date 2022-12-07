import { Settings } from '../schemas/settings.schema';
import { v4 as uuid } from 'uuid';

export const unlayerSettingsFonts: Settings['fonts'] = [
  {
    id: uuid(),
    label: 'Andale Mono',
    style: 'andale mono,times',
    value: true,
  },
  {
    id: uuid(),
    label: 'Arial',
    style: 'arial,helvetica,sans-serif',
    value: true,
  },
  {
    id: uuid(),
    label: 'Arial Black',
    style: 'arial black,avant garde,arial',
    value: true,
  },
  {
    id: uuid(),
    label: 'Book Antiqua',
    style: 'book antiqua,palatino',
    value: true,
  },
  {
    id: uuid(),
    label: 'Comic Sans MS',
    style: 'comic sans ms,sans-serif',
    value: true,
  },
  {
    id: uuid(),
    label: 'Courier New',
    style: 'courier new,courier',
    value: true,
  },
  {
    id: uuid(),
    label: 'Georgia',
    style: 'georgia,palatino',
    value: true,
  },
  {
    id: uuid(),
    label: 'Helvetica',
    style: 'helvetica,sans-serif',
    value: true,
  },
  {
    id: uuid(),
    label: 'Impact',
    style: 'impact,chicago',
    value: true,
  },
  {
    id: uuid(),
    label: 'Symbol',
    style: 'symbol',
    value: true,
  },
  {
    id: uuid(),
    label: 'Tahoma',
    style: 'tahoma,arial,helvetica,sans-serif',
    value: true,
  },
  {
    id: uuid(),
    label: 'Terminal',
    style: 'terminal,monaco',
    value: true,
  },
  {
    id: uuid(),
    label: 'Times New Roman',
    style: 'times new roman,times',
    value: true,
  },
  {
    id: uuid(),
    label: 'Trebuchet MS',
    style: 'trebuchet ms,geneva',
    value: true,
  },
  {
    id: uuid(),
    label: 'Verdana',
    style: 'verdana,geneva',
    value: true,
  },
];
