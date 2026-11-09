import { useState } from "react";

const DO_NOT_ASK = [
  "Age, graduation years, family, kids, religion, national origin, or citizenship beyond the work authorization line",
  "Health, disability, arrests, convictions, current or past pay, cannabis, credit, or housing",
  "Do not say contractor. Say 1099 position.",
  "Do not mention benefits. If they ask, say you will pass that along so it can be answered directly.",
  "Do not give a follow up date. The close already covers next steps.",
  "Do not talk about coworkers or escalating to a teammate. There are none at this level.",
];

const AFTER = [
  "Score communication, how they work with clients, troubleshooting approach, and culture fit from 1 to 5 each.",
  "Note any red flags, then decide pass, hold, or no.",
];

const PEOPLE = [
  {
    id: "steve",
    name: "Steve Quintanilla",
    when: "Friday Nov 6, 1:00 to 1:15 PM Pacific",
    switchLabel: "Steve, 1:00 to 1:15",
    facts: [
      ["Score", "7.0, Phone screen band, rank 13"],
      ["Location", "Sunland 91040, about 22 miles; he said under an hour"],
      ["IT experience", "About 10.7 dedicated years"],
      ["MSP", "No, in-house roles only"],
      ["Pay note", "Said the pay works and 1099 is fine"],
      ["Start", "About a week"],
      ["Certs", "None listed"],
    ],
    warning: "This slot was moved: Thursday at 1:00 PM was canceled. Indeed shows Friday at the same time as confirmed.",
    resume: [
      ["Package Handler", "OnTrac, Burbank", "Mar 2026 to present"],
      ["Regional Sr. IT Analyst", "TCS Education System, Los Angeles", "Aug 2017 to Aug 2025"],
      ["Deskside Support Analyst", "Centene, Woodland Hills", "Dec 2014 to Aug 2017"],
    ],
    summary:
      "At TCS he spent about eight years helping staff and students with computers, accounts, email, and classroom technology. Before that he did deskside support in Woodland Hills. He has been out of IT since August 2025 and has been a package handler at OnTrac since March 2026.",
    listen: [
      "Why he wants hands on help desk work after a senior title",
      "Whether he is ready to come back to IT full time, without pressing on anything personal",
      "How he talks to people who are not technical",
      "How he would handle being the person several different companies call in one day",
      "What tools he actually used when helping people, in his own words",
      "Whether he sounds like a fit for a small company where clients know you by name",
    ],
    steps: [
      { title: "Recording", say: ["Hi Steve, thanks for making time. Just so you know, I'd like to record this for our review. Is that okay?"] },
      { title: "Terms", say: ["Quick check before we dive in. As we mentioned in our Indeed message, this is on site in Woodland Hills, Monday to Friday, nine to five, as a 1099 position at twenty to thirty an hour depending on experience. The role also includes driving to client sites around LA, and mileage is reimbursed. Is all of that still good for you?"] },
      { title: "If pay is a question", say: ["What rate within that range would you be looking for?"], note: "Never ask what he made before." },
      { title: "If travel is a question", say: ["Do you have reliable transportation to get to client sites around LA?"], note: "A clear no ends the call politely." },
      { title: "Start date", say: ["And if things move forward, when could you start?"], note: "He said about a week." },
      { title: "Work authorization", say: ["And are you legally authorized to work in the US, and will you now or in the future require visa sponsorship?"] },
      { title: "About us", say: ["Quick bit about us: Intelligent IT is a boutique managed IT company here in Woodland Hills, started in 2015 by Ryan and me, and we still run it. We're the IT department for small and mid-sized businesses around LA. We're small on purpose, so clients know us by name and stay with us about nine years on average. Okay, enough about us. Tell me about you."] },
      { title: "Their role", say: ["Walk me through your last IT role at TCS. What did a typical day look like, and who were you usually helping?"] },
      { title: "Why looking", say: ["What's got you looking for something new right now?"] },
      { title: "Why this level", say: ["Your last title was Regional Sr. IT Analyst. This role is hands on help desk work. What draws you to it at this level?"] },
      { title: "Coming back to IT", say: ["Your time at TCS ended in August 2025, and since March you've been at OnTrac. What's got you ready to jump back into IT full time?"], note: "Accept a brief answer. If it is personal, do not probe." },
      { title: "Working with clients", say: ["An office manager calls, pretty upset. Email's been down for two hours, and it's the third problem this week. What do you say to her in the first minute?"] },
      { title: "Non-technical people", say: ["How do you explain a technical problem to someone who isn't technical, and just wants it fixed?"] },
      { title: "Troubleshooting", say: ["Tell me about a time something broke and you didn't know the answer right away. How did you figure it out?"] },
      { title: "Tools", say: ["What tools did you use day to day when you were helping people at TCS? Which ones were you actually hands on with?"] },
      { title: "Several companies", say: ["All your roles have been in house at one company. Here you'd support several different businesses in one day. How do you think you'd keep them straight?"] },
      { title: "Culture", say: ["We're a small company, so you'd often be the person a client talks to, and there isn't a bigger team to hand the work to. How do you feel about that kind of setup?"] },
      { title: "When you're stuck", say: ["When you get stuck and there isn't someone next to you to take over, what do you usually do?"] },
      { title: "Certs", say: ["Almost done, just a quick wrap up. Do you have any certifications?"] },
      { title: "References", say: ["Could you reply in your Indeed message thread with one or two professional references, ideally a former manager or supervisor, with their name, the company, how you worked together, and a phone number or email? And are you okay with us contacting them?"] },
      { title: "Their questions", say: ["Before we wrap up, do you have any questions for us, or any concerns about the role?"] },
      { title: "Close", say: ["We review every call. If it's a fit, we'll reach out about next steps. Thanks so much for your time today, Steve."] },
    ],
  },
];

function PersonScript({ person }) {
  return (
    <div>
      <h2>
        {person.name}
      </h2>
      <p className="lede">{person.when}</p>
      <dl className="props">
        {person.facts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="for-you">
        <strong>Note</strong>
        {person.warning}
      </p>
      <h3>Resume</h3>
      <div className="script-table-wrap">
        <table className="script-md">
          <thead>
            <tr>
              <th>Role</th>
              <th>Employer</th>
              <th>Dates</th>
            </tr>
          </thead>
          <tbody>
            {person.resume.map((row) => (
              <tr key={row.join("|")}>
                {row.map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>{person.summary}</p>
      <h3>What to listen for</h3>
      <ul>
        {person.listen.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h3>Script, say this</h3>
      <ol className="say-list">
        {person.steps.map((step) => (
          <li key={step.title}>
            <h3>{step.title}</h3>
            {step.say.map((line) => (
              <p className="say" key={line}>
                {line}
              </p>
            ))}
            {step.note ? (
              <p className="for-you">
                <strong>For you</strong>
                {step.note}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TodayInterviews() {
  const [who, setWho] = useState(PEOPLE[0].id);
  const person = PEOPLE.find((item) => item.id === who) ?? PEOPLE[0];
  return (
    <div role="tabpanel" id="panel-today" aria-labelledby="tab-today" className="phone-script">
      <h1>Today's interviews</h1>
      <p className="lede">
        Friday Nov 6, 2026. People first script for the call. Say the lines in the boxes. Do not add questions.
      </p>
      <div className="today-switch" role="group" aria-label="Choose today's interview">
        {PEOPLE.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === person.id ? "on" : ""}
            aria-pressed={item.id === person.id}
            onClick={() => setWho(item.id)}
          >
            {item.switchLabel}
          </button>
        ))}
      </div>
      <PersonScript person={person} />
      <aside className="dont-ask">
        <h3>Do not ask</h3>
        <ul>
          {DO_NOT_ASK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>
      <details className="step">
        <summary>After the call</summary>
        <div className="step-body">
          {AFTER.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </details>
    </div>
  );
}
