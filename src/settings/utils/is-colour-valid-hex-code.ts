export const isColourValidHexCode = (inputValue?: string) => {
  const regex = /^#[0-9a-f]{6}/i;

  if (inputValue && regex.exec(inputValue) && inputValue.length === 7) {
    return true;
  }
  return false;
};
