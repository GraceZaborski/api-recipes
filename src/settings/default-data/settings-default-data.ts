import { SettingsDto } from '../../templates/dto/settings.dto';
import { unlayerContentTools } from './unlayer-content-tools';
import { unlayerSettingsFonts } from './unlayer-system-fonts';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const { value, ...defaultFont } = unlayerSettingsFonts[1];

export const settingsDefaultData: SettingsDto = {
  contentTools: unlayerContentTools,
  colours: [],
  backgroundColour: undefined,
  fonts: unlayerSettingsFonts,
  defaultFont: defaultFont,
};
