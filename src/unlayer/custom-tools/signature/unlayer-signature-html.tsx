import * as React from "react";
import * as ReactDOMServer from "react-dom/server";


const screenshot = 'data:image/png;base64,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XaqbePXVV9tvf/tbqyf77befDRy48dC3qVOnluwOK9ucNGlS9/11AWrFr+Xa8N4GrJ6WNOp5iqvoUTTJvd4LPTqr5Lvf/W5dnr2j7nBIBZ2evPjii0GXV9Rdf/nllze7fYsttrBPfOITQcFFXfV3333XXn31VXvggQfs+eef777fJz/5SRszZsxmZ9x/5StfsTVr1tiCBQuCbr+GBESFJvnQhz5kN954Y/D9lClT7KWXXgq+/9KXvhTc58knn7Tf/e533c+nsVd17f/0pz/ZI488YmPHjrVDDjkkuE5DCjq5cPLkybZ48eKSbdUY6HnnnRcMPWhMVL+X2vCLX/wiGMM94ogj7K9//WtQWCqmotPpp59ue+65p2211VbB30zFp1/+8pfB3wTx+bWclK7AV1gJL0dZ5PT8pZQwiLpOMSr3XPVC/1C/973v2dq1a60eKaCFVORRQChl6dKl9ulPf7rkbcpMb775Ztt3332Dn5WdKljocswxx9jPf/7zIAjKXnvtZaNHj97s8QqGooKOKvLFtyt4hdcNHjy4+3oFv4MOOiio1BfaZ599gvu/99579vGPf9xGjhzZfZsCmALg4YcfbhdeeKEtWrRos8fuvffewVjtLrvs0n2dgqYuhx12mK1fvz74XgG0mIYz9DcM6e+g30UX/R7qefz97383xFPzMcswaEUFTJfgpvsoYJajoFrvGaW63PU2RlnszTfftOeee84OPfRQO//884MMUQFTmZ6LpqamoACjQPnKK68EQVOZm4LaOeecE2R1CkqzZ88OKuq33nqr3XbbbUFGG3btVcnWY3RAloYzlKHKV7/61SBTnTVrll133XXBda6/l5x88sm2cuXK4HX+9re/BdmspkadffbZQYBXe7///e93318V+gkTJgSBUkFRBS2N4yqAKxvWWG1YwS926qmndgfKn/3sZ/b4448HHzAqnunvoICp8eALLrigbAaPaInYdSgqYN7vmAW+uGkOZU/ZZSMESgXJehufLEU9GgUMdXPVpdU/7NNOO82efvrp4NzoZ555xtrb23t8/Kc+9akg41q2bJmNHz/eVq9eHVy/fPlyu/32223HHXe0E044wT7/+c8HtysY6lIYdPQYBbVQ+P2GDRuCrwqihbe7UmangpQCdUiZ9LBhw4KutLrmhY499tgg85WrrroqCNIhdaeVwd5www1B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';


const UnlayerSignatureMissing = () => (
  <div
    style={{
      height: "100%",
      backgroundColor: "rgb(255, 241, 199)",
      padding: "10px",
    }}
  >
    <div style={{ lineHeight: "140%", textAlign: "center", color: "#704d00" }}>
      <p>You havent created a signature yet.</p>
      <p>
        You can do this in <strong>Settings</strong>.
      </p>
      <div style={{ padding: "10px" }}>
        <img
          alt="Navigate to settings page"
          src={screenshot}
          style={{ maxWidth: "160px" }}
        />
      </div>
      <p>Once you have done that, please try again.</p>
    </div>
  </div>
);

export const unlayerSignatureMissingHtml = ReactDOMServer.renderToString(
  <UnlayerSignatureMissing />
).replace(/"/g, "'");
