import { mergeStringifiedObjects } from '../unlayer-tools-utils';
import { unlayerSignatureMissingHtml } from './unlayer-signature-html';

export const getSignatureToolConfig = ({
  user,
}: {
  user?: any;
  company?: any;
}) => {
  const { emailSignature = null } = user;
  const signatureHtml: string = emailSignature || unlayerSignatureMissingHtml;

  console.log(signatureHtml);
  console.log(user);
  const staticConfig = JSON.stringify({
    name: 'signature',
    supportedDisplayModes: ['email'],
    label: 'Signature',
    // TODO: replace the data url below with the url to the image file
    icon: 'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjM0IiB2aWV3Qm94PSIwIDAgMzQgMzQiIHdpZHRoPSIzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBzdHJva2U9IiM1MTU2NTkiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyLjI1Ij48cGF0aCBkPSJtMTIuNzUgMjguNjg3NWgtNi4zNzVjLS4yODE3OSAwLS41NTIwNC0uMTExOS0uNzUxMy0uMzExMi0uMTk5MjYtLjE5OTItLjMxMTItLjQ2OTUtLjMxMTItLjc1MTN2LTUuOTM0OWMwLS4xMzk1LjAyNzQ4LS4yNzc3LjA4MDg4LS40MDY2LjA1MzM5LS4xMjg5LjEzMTY2LS4yNDYuMjMwMzItLjM0NDdsMTUuOTM3NS0xNS45Mzc0OWMuMTk5My0uMTk5MjYuNDY5NS0uMzExMi43NTEzLS4zMTEycy41NTIuMTExOTQuNzUxMy4zMTEybDUuOTM0OSA1LjkzNDg5Yy4xOTkzLjE5OTMuMzExMi40Njk1LjMxMTIuNzUxM3MtLjExMTkuNTUyMS0uMzExMi43NTEzeiIvPjxwYXRoIGQ9Im0xOC4wNjI1IDguNSA3LjQzNzUgNy40Mzc1Ii8+PHBhdGggZD0ibTUuODQzNzUgMjAuNzE4OCA3Ljk2ODc1IDcuOTY4NyIvPjxwYXRoIGQ9Im0yOC42ODc1IDI4LjY4NzVoLTE1LjkzNzUiLz48L2c+PC9zdmc+',
    usageLimit: 1,
  });

  const renderer = `{
    renderer: {
      Viewer: window.unlayer.createViewer({
        render: () => "${signatureHtml}",
      }),
      exporters: {
        email: () => "${signatureHtml}",
      }
    }
  }`.replace(/\n/g, '');

  const config = mergeStringifiedObjects(staticConfig, renderer);

  return config;
};
