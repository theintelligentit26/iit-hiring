import markdown from "./phone-screen-v3.3.md?raw";
import { QUICK_VIEW_URL } from "./script-content.js";
import { renderScriptMarkdown } from "./script-markdown.js";

const html = renderScriptMarkdown(markdown);

export function ScriptTab() {
  return (
    <div className="phone-script script-doc">
      <p className="lede">
        <button
          type="button"
          className="ghost"
          onClick={() => window.dispatchEvent(new Event("iit-open-today"))}
        >
          Today's interviews: Trishan 11:15 to 11:30, Steve 1:00 to 1:15
        </button>
        {" "}
        <a href={QUICK_VIEW_URL} target="_blank" rel="noreferrer">
          Owner’s quick view
        </a>
      </p>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
