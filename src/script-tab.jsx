import { useState } from "react";
import {
  AREAS,
  DONT,
  LOGI,
  QUICK_VIEW_URL,
  RUBRIC,
  SOFT,
  TECH,
} from "./script-content.js";

function Question({ item }) {
  return (
    <li className="q-block">
      <p>
        {item.q} <span className="area-tag">({item.area})</span>
      </p>
      <p className="good-answer">
        <strong>Good answer sounds like: </strong>
        {item.good}
      </p>
      <p className="red-flag">
        <strong>Red flags: </strong>
        {item.red}
      </p>
    </li>
  );
}

export function ScriptTab() {
  const [scores, setScores] = useState({});
  const vals = AREAS.map(([name]) => Number(scores[name] ?? 0)).filter(
    (v) => v > 0,
  );
  const total = vals.reduce((sum, n) => sum + n, 0);
  const avg = vals.length ? total / vals.length : 0;
  const tally = vals.length
    ? `Tally: ${total} of ${vals.length * 5} across ${vals.length} of ${AREAS.length} areas (average ${avg.toFixed(1)} of 5).`
    : `Tally: score each area as you go, out of ${AREAS.length * 5}.`;

  return (
    <div className="phone-script">
      <h1>Interview Script &amp; Phone Screening</h1>
      <p className="lede">
        A phone-interview guide to read from on the call, about 20 minutes.
        Open one part at a time. The candidate’s card has questions about their
        own resume.
      </p>
      <p className="lede">
        <a href={QUICK_VIEW_URL} target="_blank" rel="noreferrer">
          Owner’s quick view
        </a>
      </p>

      <details className="step" open>
        <summary>
          <span className="step-time">2 min</span>
          1. Opening script
        </summary>
        <div className="step-body">
          <p className="say">
            “Hi, this is Hooman from Intelligent IT. Thanks for making time.
            We’re a boutique MSP in Woodland Hills, 91367. We take care of
            day-to-day IT for small and mid-size businesses: Microsoft 365,
            computers, printers, networks and on-site visits.”
          </p>
          <p className="say">
            “This call is for our IT Help Desk role. It’s on site, Monday to
            Friday, 9am to 5pm, as a 1099 contractor at $20 to $30 an hour
            depending on experience. I’ll check a few logistics, ask some
            technical and scenario questions, then leave time for yours. It
            should take about 20 minutes. Is now still a good time?”
          </p>
        </div>
      </details>

      <details className="step">
        <summary>Do not ask</summary>
        <div className="step-body">
          <aside className="dont-ask">
            <h3>Do not ask</h3>
            <ul>
              {DONT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </details>

      <details className="step">
        <summary>
          <span className="step-time">4 min</span>
          2. Logistics checks
        </summary>
        <div className="step-body">
          <ol className="script-list">
            {LOGI.map(([title, detail]) => (
              <li key={title}>
                <strong>{title}.</strong> {detail}
              </li>
            ))}
          </ol>
          <p>
            If any answer is a clear no, thank them and end the call politely.
            Don’t talk them into a yes.
          </p>
        </div>
      </details>

      <details className="step">
        <summary>
          <span className="step-time">10 min</span>
          3. Technical and scenario questions
        </summary>
        <div className="step-body">
          <ol className="script-list">
            {TECH.map((item) => (
              <Question key={item.q} item={item} />
            ))}
          </ol>
          <p>
            Short on time: ask 1, 4, 6, 8 and 10. The rubric area each question
            feeds is in brackets.
          </p>
        </div>
      </details>

      <details className="step">
        <summary>
          <span className="step-time">3 min</span>
          4. Soft skills and culture
        </summary>
        <div className="step-body">
          <ol className="script-list">
            {SOFT.map((item) => (
              <Question key={item.q} item={item} />
            ))}
          </ol>
        </div>
      </details>

      <details className="step">
        <summary>
          <span className="step-time">3 min</span>
          5. Their questions and closing
        </summary>
        <div className="step-body">
          <p className="say">
            “What questions do you have about the work, our clients or a normal
            day?” Answer plainly. If you don’t know something, say you’ll
            confirm. Don’t promise W-2 status or benefits.
          </p>
          <p className="say">
            “Thanks for your time today. If we both want to move forward, the
            next step is an in-person interview at our Woodland Hills office or
            a short hands-on test: setting up a PC, creating a Microsoft 365
            user, adding a printer and writing a ticket note. We’re scheduling
            those this week, and I’ll follow up with you by Friday, November 6,
            either way.”
          </p>
        </div>
      </details>

      <details className="step">
        <summary>6. Quick scoring checklist (1–5 per area)</summary>
        <div className="step-body">
          <div className="score-card">
            <h3>Score this call, 1 to 5</h3>
            <p>
              5 is a clear yes, 3 is mixed, 1 is a stop. Scores are not saved.
            </p>
            {AREAS.map(([name, hint]) => (
              <div className="score-item" key={name}>
                <div>
                  <strong>{name}</strong>
                  <div className="muted">{hint}</div>
                </div>
                <div className="score-pips" role="group" aria-label={`${name} score`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={Number(scores[name]) === n ? "pip on" : "pip"}
                      aria-pressed={Number(scores[name]) === n}
                      onClick={() =>
                        setScores((prev) => ({ ...prev, [name]: String(n) }))
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <p className="score-total">{tally}</p>
            <p>
              Average 4 or more: invite to the in-person interview. 3 to 3.9:
              hands-on test first. Under 3: pass.
            </p>
            <button
              type="button"
              className="ghost"
              onClick={() => setScores({})}
            >
              Clear scores
            </button>
          </div>
        </div>
      </details>

      <details className="step">
        <summary>How recommendations work and the rubric</summary>
        <div className="step-body">
          <table className="rubric">
            <thead>
              <tr>
                <th scope="col">Rubric area</th>
                <th scope="col">Weight</th>
              </tr>
            </thead>
            <tbody>
              {RUBRIC.map(([area, weight]) => (
                <tr key={area}>
                  <td>{area}</td>
                  <td>{weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="rubric">
            <thead>
              <tr>
                <th scope="col">Score (out of 10)</th>
                <th scope="col">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>7.5 and up</td>
                <td>Interview</td>
              </tr>
              <tr>
                <td>6.0 to 7.4</td>
                <td>Phone screen</td>
              </tr>
              <tr>
                <td>4.5 to 5.9</td>
                <td>Hold</td>
              </tr>
              <tr>
                <td>Under 4.5</td>
                <td>Decline</td>
              </tr>
            </tbody>
          </table>
          <ul>
            <li>
              Each area is scored, then weighted; the overall score is the
              weighted average to one decimal, plus the cert bonus.
            </li>
            <li>
              Red flags (unverifiable employers, resume and LinkedIn mismatches,
              inflated screener answers, a commute over 25 miles) can lower a
              recommendation below its band. “Pay fit?” marks senior titles
              that may expect more than $20–30/hr.
            </li>
            <li>
              Fit is judged from titles, duties and pay expectations, never age.
            </li>
          </ul>
        </div>
      </details>
    </div>
  );
}
