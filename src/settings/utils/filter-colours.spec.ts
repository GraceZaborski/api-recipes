import { filterColours, isColourValidHexCode } from './filter-colours';

describe('filterColours', () => {
  it('deduplicates colours', () => {
    expect(
      filterColours([
        { id: '1', colour: '#ffffff' },
        { id: '2', colour: '#ffffff' },
        { id: '3', colour: '#000000' },
      ]),
    ).toEqual([
      { id: '2', colour: '#ffffff' },
      { id: '3', colour: '#000000' },
    ]);
  });
});

describe('isColourValidHexCode', () => {
  it('returns true for a valid 6-digit hex code', () => {
    expect(isColourValidHexCode('#1a2b3c')).toEqual(true);
  });

  it('returns true for a valid 6-digit hex code with capitalised letters', () => {
    expect(isColourValidHexCode('#AA9900')).toEqual(true);
  });

  it('returns false when the # is in the wrong position', () => {
    expect(isColourValidHexCode('1#a2b3c')).toEqual(false);
  });

  it('returns false when there are not 7 characters', () => {
    expect(isColourValidHexCode('#123')).toEqual(false);
    expect(isColourValidHexCode('#123abcd')).toEqual(false);
  });

  it('returns false when the letters are outside of A-F', () => {
    expect(isColourValidHexCode('#GG00AA')).toEqual(false);
  });
});
