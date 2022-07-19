#!/usr/bin/env node
/* eslint-disable */
const prompts = require('prompts');
const { env } = require('./updateEnv');

const localEnv = env('./.env.local');

const STAGING_ENVIRONMENT = 'API_CAMPAIGNS_TEAM_ENV';
const X_TOKEN_PAYLOAD = 'API_CAMPAIGNS_X_TOKEN_PAYLOAD';
const USER_NAME = 'API_CAMPAIGNS_GET_TOKEN_USER_NAME';

const questions = [
  {
    type: 'text',
    name: 'environment',
    message: 'What staging environment are you connecting to?',
    initial: localEnv.readKey(STAGING_ENVIRONMENT)
      ? localEnv.readKey(STAGING_ENVIRONMENT)
      : 'aether',
  },
  {
    type: 'text',
    name: 'username',
    message: 'What is your username?',
    initial: localEnv.readKey(USER_NAME) ? localEnv.readKey(USER_NAME) : '',
  },
  {
    type: 'password',
    name: 'password',
    message: 'What is your password?',
  },
];

const main = async () => {
  const { fetch, CookieJar } = await import('node-fetch-cookies');
  const response = await prompts(questions);

  if (!(response.environment && response.username && response.password)) {
    console.error('Please provider all options.');
    process.exit(1);
  }

  localEnv.writeKey(STAGING_ENVIRONMENT, response.environment);
  localEnv.writeKey(USER_NAME, response.username);

  const apiUrl = `https://api.${response.environment}.staging.beamery.engineer`;

  const cookieJar = new CookieJar();

  const xsrfRes = await fetch(cookieJar, `${apiUrl}/xsrf-token`, {
    credentials: 'same-origin',
  });
  const { token } = await xsrfRes.json();

  const loginRes = await fetch(cookieJar, `${apiUrl}/user/login`, {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'x-xsrf-beamery': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: response.username,
      password: response.password,
    }),
  });

  if (loginRes.status === 200) {
    const {
      id: userid,
      companyId: companyid,
      email: username,
      roles,
    } = await loginRes.json();
    console.info(`Logged in as ${username}`);

    const authContext = {
      aud: ['Beamery'],
      companyid,
      exp: 1611668301,
      iat: 1611581901,
      iss: 'Beamery',
      nbf: 1611581901,
      roles: roles.join(','),
      sub: 'dacc33fc2e2b086f5ac2',
      userid,
      username,
    };

    const xTokenPayload = Buffer.from(JSON.stringify(authContext)).toString(
      'base64',
    );

    console.log(`x-token-payload: ${xTokenPayload}`);
    localEnv.writeKey(X_TOKEN_PAYLOAD, xTokenPayload);

    return;
  }

  if (loginRes.status === 401) {
    return console.error((await loginRes.json()).message);
  }

  let error,
    message = '';
  try {
    const res = await loginRes.json();
    error = res.error;
    message = res.message;
  } catch (error) {}

  return console.error(
    `Unknown error. Status: ${loginRes.status}`,
    error,
    message,
  );
};

main();
