export const getToolRegistrationCode = (config: string) =>
  `window.unlayer.registerTool(${config});`;

export const mergeStringifiedObjects = (partOne: string, partTwo: string) =>
  `${partOne.slice(0, -1)}, ${partTwo.slice(1)}`;
