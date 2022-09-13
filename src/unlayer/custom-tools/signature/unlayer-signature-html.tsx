import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';

const screenshot =
  'https://campaign-v2-public.beamery.com/e41aa3683110c18c11b143ac7163f05d22dc741d9f82dc8adfe49d3d0c7c776f/8a728c45-fa74-4176-9b9f-5f188a916f07.png';

const UnlayerSignatureMissing = () => (
  <div
    style={{
      height: '100%',
      backgroundColor: 'rgb(255, 241, 199)',
      padding: '10px',
    }}
  >
    <div style={{ lineHeight: '140%', textAlign: 'center', color: '#704d00' }}>
      <p>You havent created a signature yet.</p>
      <p>
        You can do this in <strong>Settings</strong>.
      </p>
      <div style={{ padding: '10px' }}>
        <img
          alt="Navigate to settings page"
          src={screenshot}
          style={{ maxWidth: '160px' }}
        />
      </div>
      <p>Once you have done that, please try again.</p>
    </div>
  </div>
);

export const unlayerSignatureMissingHtml = ReactDOMServer.renderToString(
  <UnlayerSignatureMissing />,
).replace(/"/g, "'");
