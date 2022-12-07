import { SettingsDto } from '../../templates/dto/settings.dto';
import { unlayerSettingsFonts } from './unlayer-system-fonts';

export const settingsDefaultData: SettingsDto = {
  colours: [],
  fonts: unlayerSettingsFonts,
  defaultFont: unlayerSettingsFonts[0],
};
