import { defaultFont, SettingsDto } from '../../templates/dto/settings.dto';
import { unlayerContentTools } from './unlayer-content-tools';
import { unlayerSettingsFonts } from './unlayer-system-fonts';

export const settingsDefaultData: SettingsDto = {
  contentTools: unlayerContentTools,
  colours: [],
  backgroundColour: '#ffffff',
  fonts: unlayerSettingsFonts,
  defaultFont: defaultFont,
};
