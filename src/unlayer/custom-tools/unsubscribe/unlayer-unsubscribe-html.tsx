import * as React from 'react';
import * as ReactDOMServer from "react-dom/server";

const UnlayerUnsubscribeDefault = () => (
  <p>
    {/* eslint-disable-next-line react/jsx-curly-brace-presence */}
    Don{"'"}t want to receive these e-mails?{" "}
    <a href="%_seed-action-url_unsubscribe_%" target="_blank">
      Click to unsubscribe
    </a>
  </p>
);

export const unlayerUnsubscribeDefaultHtml = ReactDOMServer.renderToString(
  <UnlayerUnsubscribeDefault />
).replace(/"/g, "'");
