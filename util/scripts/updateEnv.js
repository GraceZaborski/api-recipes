#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');

const env = (envFilePath) => {
  // Load the .env file.
  let envs = '';
  try {
    envs += fs.readFileSync(envFilePath);
  } catch (e) {
    // NOOP
  }

  /**
   * Reads a key's value from `.env.local`.
   *
   * @arg {string} key
   */
  const readKey = (key) => {
    const match = envs.match(RegExp(`(?<=${key}=)(.+)$`, 'gm'));
    return match ? match[0] : null;
  };

  /**
   * Writes or updates a key and value to `.env.local`.
   *
   * @arg {string} key
   * @arg {string} value
   */
  const writeKey = (key, value) => {
    // Update or add to the .env file contents.
    if (RegExp(`(?<=${key}=)`, 'gm').test(envs)) {
      envs = envs.replace(RegExp(`(?<=${key}=).+$`, 'gm'), value);
    } else {
      // Add a new line if the file doesn't end with a new line.
      if (envs && !envs.endsWith('\n')) {
        envs += '\n';
      }
      envs += `${key}=${value}\n`;
    }

    // Write our new .env file.
    fs.writeFileSync(envFilePath, envs, 'utf8');
  };

  return {
    readKey,
    writeKey,
  };
};

module.exports = {
  env,
};
