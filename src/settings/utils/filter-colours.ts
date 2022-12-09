import { SettingsDto } from '../../templates/dto/settings.dto';

export const isColourValidHexCode = (inputValue?: string) => {
  const regex = /^#[0-9a-f]{6}/i;

  if (inputValue && regex.exec(inputValue) && inputValue.length === 7) {
    return true;
  }
  return false;
};

export const filterColours = (colours: SettingsDto['colours']) => {
  const filteredArray = colours.filter(
    (colour, index) =>
      !colours.includes(colour, index + 1) && isColourValidHexCode(colour),
  );
  return filteredArray;
};
