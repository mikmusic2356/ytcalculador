import { CalculatorConfig } from '../../types';
import { VIDEO_ENCODING_CALCULATORS } from './videoEncoding';
import { VIDEO_RESOLUTION_CALCULATORS } from './videoResolution';
import { VIDEO_STORAGE_CALCULATORS } from './videoStorage';
import { VIDEO_FPS_CALCULATORS } from './videoFps';

export const VIDEO_CALCULATORS: CalculatorConfig[] = [
  ...VIDEO_ENCODING_CALCULATORS,
  ...VIDEO_RESOLUTION_CALCULATORS,
  ...VIDEO_STORAGE_CALCULATORS,
  ...VIDEO_FPS_CALCULATORS,
];

export {
  VIDEO_ENCODING_CALCULATORS,
  VIDEO_RESOLUTION_CALCULATORS,
  VIDEO_STORAGE_CALCULATORS,
  VIDEO_FPS_CALCULATORS,
};
