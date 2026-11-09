import { PHONE_SCREEN_MD } from "./phone-screen-source.js";
import { QUICK_VIEW_URL } from "./script-content.js";
import { renderScriptMarkdown } from "./script-markdown.js";

const html = renderScriptMarkdown(PHONE_SCREEN_MD);

export function ScriptTab() {
  return (
    <div className="phone-script script-doc">
      <p className="lede">
        <a href="./index.html">Hiring portal</a>
        {" · "}
        <a href={QUICK_VIEW_URL} target="_blank" rel="noreferrer">
          Owner’s quick view
        </a>
      </p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
