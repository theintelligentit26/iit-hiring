import markdown from "./phone-screen-v3.3.md?raw";
import { QUICK_VIEW_URL } from "./script-content.js";
import { renderScriptMarkdown } from "./script-markdown.js";

const html = renderScriptMarkdown(markdown);

export function ScriptTab() {
  return (
    <div className="phone-script script-doc">
      <p className="lede">
        <a href={QUICK_VIEW_URL} target="_blank" rel="noreferrer">
          Owner’s quick view
        </a>
      </p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
