import { SettingsDto } from '../../templates/dto/settings.dto';
import { unlayerContentTools } from './unlayer-content-tools';
import { unlayerGoogleFonts, unlayerSystemFonts } from './unlayer-system-fonts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const { value, ...defaultFont } = unlayerSystemFonts[1];

export const settingsDefaultData: SettingsDto = {
  contentTools: unlayerContentTools,
  colours: [],
  backgroundColour: undefined,
  systemFonts: unlayerSystemFonts,
  googleFonts: unlayerGoogleFonts,
  defaultFont: defaultFont,
};
