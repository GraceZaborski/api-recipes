import { getToolRegistrationCode } from './unlayer-tools-utils';
import { unlayerUnsubscribeDefaultHtml } from './unsubscribe/unlayer-unsubscribe-html';
import { getSignatureToolConfig, getUnsubscribeToolConfig } from '.';

describe('getToolRegistrationCode', () => {
  it('outputs expected code', () => {
    expect(getToolRegistrationCode('some-code')).toMatchInlineSnapshot(
      `"window.unlayer.registerTool(some-code);"`,
    );
  });
});

describe('getSignatureToolConfig', () => {
  it('outputs expected config', () => {
    expect(
      getSignatureToolConfig({ user: { emailSignature: 'some-signature' } }),
    ).toMatchInlineSnapshot(
      `"{\\"name\\":\\"signature\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Signature\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHdpZHRoPSIzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyLjI1Ij48cGF0aCBkPSJtMTIuNzUgMjguNjg3NWgtNi4zNzVjLS4yODE3OSAwLS41NTIwNC0uMTExOS0uNzUxMy0uMzExMi0uMTk5MjYtLjE5OTItLjMxMTItLjQ2OTUtLjMxMTItLjc1MTN2LTUuOTM0OWMwLS4xMzk1LjAyNzQ4LS4yNzc3LjA4MDg4LS40MDY2LjA1MzM5LS4xMjg5LjEzMTY2LS4yNDYuMjMwMzItLjM0NDdsMTUuOTM3NS0xNS45Mzc0OWMuMTk5My0uMTk5MjYuNDY5NS0uMzExMi43NTEzLS4zMTEycy41NTIuMTExOTQuNzUxMy4zMTEybDUuOTM0OSA1LjkzNDg5Yy4xOTkzLjE5OTMuMzExMi40Njk1LjMxMTIuNzUxM3MtLjExMTkuNTUyMS0uMzExMi43NTEzeiIvPjxwYXRoIGQ9Im0xOC4wNjI1IDguNSA3LjQzNzUgNy40Mzc1Ii8+PHBhdGggZD0ibTUuODQzNzUgMjAuNzE4OCA3Ljk2ODc1IDcuOTY4NyIvPjxwYXRoIGQ9Im0yOC42ODc1IDI4LjY4NzVoLTE1LjkzNzUiLz48L2c+PC9zdmc+\\",\\"usageLimit\\":1,     renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"some-signature\\",      }),      exporters: {        email: () => \\"some-signature\\",      }    }  }"`,
    );
  });
});

describe('getUnsubscribeToolConfig', () => {
  it('outputs expected config', () => {
    const html =
      '<p>some message <a href="%_seed-action-url_unsubscribe_%" target="_blank">Click to unsubscribe</a></p>';
    const company = {
      settings: {
        campaigns: {
          unsubscribe: {
            url: {
              html,
            },
          },
        },
      },
    };

    expect(getUnsubscribeToolConfig({ company })).toMatchInlineSnapshot(
      `"{\\"name\\":\\"unsubscribe\\",\\"supportedDisplayModes\\":[\\"email\\"],\\"label\\":\\"Unsubscribe\\",\\"icon\\":\\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNCAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIzLjExMDQgMTEuNDIxOUwyOC42ODcgMTdMMjMuMTEwNCAyMi41NzgxIiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMy44MTI1IDE3SDI4LjY4MzYiIHN0cm9rZT0iIzUxNTY1OSIgc3Ryb2tlLXdpZHRoPSIyLjI1IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTEzLjgxMjUgMjguNjg3NUg2LjM3NUM2LjA5MzIxIDI4LjY4NzUgNS44MjI5NiAyOC41NzU2IDUuNjIzNyAyOC4zNzYzQzUuNDI0NDQgMjguMTc3IDUuMzEyNSAyNy45MDY4IDUuMzEyNSAyNy42MjVWNi4zNzVDNS4zMTI1IDYuMDkzMjEgNS40MjQ0NCA1LjgyMjk2IDUuNjIzNyA1LjYyMzdDNS44MjI5NiA1LjQyNDQ0IDYuMDkzMjEgNS4zMTI1IDYuMzc1IDUuMzEyNUgxMy44MTI1IiBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS13aWR0aD0iMi4yNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=\\",\\"usageLimit\\":1,     renderer: {      Viewer: window.unlayer.createViewer({        render: () => \\"<p>some message <a href='%_seed-action-url_unsubscribe_%' target='_blank'>Click to unsubscribe</a></p>\\",      }),      exporters: {        email: () => \\"<p>some message <a href='%_seed-action-url_unsubscribe_%' target='_blank'>Click to unsubscribe</a></p>\\",      }    }  }"`,
    );
  });

  it('uses default unsubscribe message when none provided', () => {
    expect(getUnsubscribeToolConfig({})).toContain(
      unlayerUnsubscribeDefaultHtml,
    );
  });
});
