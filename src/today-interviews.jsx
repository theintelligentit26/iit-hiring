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
    id: "geordin",
    name: "Geordin Smith",
    when: "Monday Nov 9, 11:00 AM Pacific",
    switchLabel: "Geordin, 11:00 AM",
    facts: [
      ["Status", "Asked, not confirmed. We wrote him late Nov 8 asking if he is available at 11:00 AM. His last Indeed note is still Nov 4."],
      ["Score", "7.7, rank 6"],
      ["Location", "Los Angeles on Indeed, no city on the resume; he said he can commute"],
      ["IT experience", "About 5.1 dedicated years"],
      ["MSP", "Yes, TechMD in Santa Ana, March 2021 to February 2022"],
      ["Pay note", "Wants $30 an hour, which is the top of the range"],
      ["Start", "Said he can start immediately. Resume shows a contract at USC Chan Division from July 2026 to October 2026."],
      ["Certs", "uCertify PC Hardware and Software, uCertify PC Operating Systems; CompTIA A+ in progress"],
    ],
    warning:
      "Ask these if nothing else: Confirm whether $30 is enough, since he asked for $30. Confirm the USC contract has ended, since he said he can start right away. Ask which city he lives in. He has had several short contracts this year; ask what was behind those ending.",
    resume: [
      ["Level II IT Support Analyst, contract", "USC Chan Division", "July 2026 to October 2026"],
      ["Senior Desktop Analyst, contract", "PBF Refining Company, Torrance Refinery", "March 2026 to July 2026"],
      ["Service Desk Analyst, contract", "ACCO Engineered Systems", "September 2025 to March 2026"],
      ["Tech Analyst", "TELAID, Riverside", "March 2025 to August 2025"],
      ["Help Desk Technician", "Target Warehouse, Riverside", "June 2024 to March 2025"],
      ["IT Technician", "Amazon, Los Angeles", "June 2022 to May 2024"],
      ["IT Support Specialist I", "TechMD, Santa Ana", "March 2021 to February 2022"],
    ],
    summary:
      "Most recent work at USC was Level 2 support for faculty, students, and staff, including accounts, workstations, and classroom AV. At PBF he led Windows 11 migration work with Intune, Entra ID, and Active Directory. TechMD was his MSP role.",
    listen: [
      "Which city he lives in, and whether the Woodland Hills commute is realistic",
      "Whether $30 an hour works, or he needs more than the posted range",
      "A clear end date for the USC contract that matches starting immediately",
      "Why the recent short contracts ended, and whether he wants something longer term",
      "How he talks to users and clients, especially when someone is upset",
      "How he figures things out when he does not know the answer",
      "What it was like supporting different customer setups at TechMD",
      "Whether he likes small company work, where he is often the person the client talks to",
    ],
    steps: [
      { title: "Recording", say: ["Hi Geordin, thanks for making time. Just so you know, I'd like to record this for our review. Is that okay?"] },
      { title: "Terms", say: ["Quick check before we dive in. As we mentioned in our Indeed message, this is on site in Woodland Hills, Monday to Friday, nine to five, as a 1099 position at twenty to thirty an hour depending on experience. The role also includes driving to client sites around LA, and mileage is reimbursed. Is all of that still good for you?"] },
      { title: "If pay is a question", say: ["You mentioned thirty. Does the top of that range work for you?"], note: "Never ask what he made before." },
      { title: "If travel is a question", say: ["Do you have reliable transportation to get to client sites around LA?", "Which city do you live in?"], note: "A clear no ends the call politely. Then ask the second line." },
      { title: "Start date", say: ["And if things move forward, when could you start?", "Your resume shows a contract at USC Chan Division through October 2026. Has that ended?"], note: "He said immediately. Then ask the second line." },
      { title: "Work authorization", say: ["And are you legally authorized to work in the US, and will you now or in the future require visa sponsorship?"] },
      { title: "About us", say: ["Quick bit about us: Intelligent IT is a boutique managed IT company here in Woodland Hills, started in 2015 by Ryan and me, and we still run it. We're the IT department for small and mid-sized businesses around LA. We're small on purpose, so clients know us by name and stay with us about nine years on average. Okay, enough about us. Tell me about you."] },
      { title: "Their role", say: ["Walk me through your most recent role at USC Chan. What does a typical day look like for you, and who are you usually helping?"] },
      { title: "Working with different clients", say: ["At TechMD you were helping customers at a managed IT company. What was that like, and how did you handle going from one company's setup to another?"] },
      { title: "Why looking", say: ["What's got you looking for something new right now? You've had a few contract roles this year at USC, PBF, and ACCO. What was behind each of those ending?"] },
      { title: "Why this role", say: ["What made you apply for this role? And where would you like your career to be in two or three years?"] },
      { title: "Working with clients", say: ["An office manager calls, pretty upset. Email's been down for two hours, and it's the third problem this week. What do you say to her in the first minute?"] },
      { title: "Non-technical people", say: ["How do you explain a technical problem to someone who isn't technical, and just wants it fixed?"] },
      { title: "Troubleshooting", say: ["Tell me about a time something broke and you didn't know the answer right away. How did you figure it out?"] },
      { title: "Tools", say: ["What tools did you use day to day to help people? Things like tickets, Microsoft 365, remote support, or anything else. Which ones were you actually hands on with?"] },
      { title: "Culture", say: ["We're a small company, so you'd often be the person a client talks to, and there isn't a bigger team to hand the work to. How do you feel about that kind of setup?"] },
      { title: "When you're stuck", say: ["When you get stuck and there isn't someone next to you to take over, what do you usually do?"] },
      { title: "Certs", say: ["Almost done, just a quick wrap up. Do you have any certifications?"] },
      { title: "References", say: ["Could you reply in your Indeed message thread with one or two professional references, ideally a former manager or supervisor, with their name, the company, how you worked together, and a phone number or email? And are you okay with us contacting them?"] },
      { title: "Their questions", say: ["Before we wrap up, do you have any questions for us, or any concerns about the role?"] },
      { title: "Close", say: ["We review every call. If it's a fit, we'll reach out about next steps. Thanks so much for your time today, Geordin."] },
    ],
  },
  {
    id: "walter",
    name: "Walter Calderon",
    when: "Monday Nov 9, 11:30 AM Pacific",
    switchLabel: "Walter, 11:30 AM",
    facts: [
      ["Status", "Confirmed. On Nov 9 at 8:58 AM Pacific he wrote: \"Yes, I'm available Monday, November 9 at 11:30 AM for the interview.\""],
      ["Score", "7.3, rank 9"],
      ["Location", "North Hills, about 12 miles; he said the commute works"],
      ["IT experience", "About 4.75 dedicated years"],
      ["MSP", "No, in house healthcare IT only"],
      ["Pay note", "On Nov 4 he answered yes to the pay. Still ask what rate within the range he would want if pay comes up. Never ask what he made before."],
      ["Start", "Two weeks notice"],
      ["Certs", "MS-900 and CompTIA A+ listed, not independently verified"],
    ],
    warning:
      "He asked: Is it contract to hire? Do not promise that. If he asks again, say you will pass that along so it can be answered directly, unless you already have an answer you want to give. Ask these if nothing else: Confirm the two week notice. If he brings up contract to hire, answer or pass it along. Listen for whether he is ready to support several different client companies after one in house employer.",
    resume: [
      ["IT Support Desk", "Valley Community Healthcare, North Hollywood", "February 2022 to present"],
      ["Sales and Service Support", "Phone Repair, Panorama City", "July 2019 to March 2020"],
      ["Food Server", "The Inn Of the Seventh Ray, Topanga", "June 2013 to February 2023"],
    ],
    summary:
      "Current work is supporting about 200 employees on a three person IT team, about 5 to 10 tickets a day, covering Windows, Microsoft 365, Active Directory, hardware, networking, VPN, and printers. He also helped with a 135 printer replacement, including print server setup.",
    listen: [
      "Whether two weeks notice still holds",
      "What rate he wants within twenty to thirty an hour, without asking what he made before",
      "How he talks to users and clients, especially when someone is upset",
      "How he would handle helping several different companies in one day, after supporting one organization",
      "How he figures things out when he does not know the answer",
      "What tools he actually used when helping people, in his own words",
      "Whether he likes small company work, where he is often the person the client talks to",
      "If he asks about contract to hire, note it and do not invent an answer",
    ],
    steps: [
      { title: "Recording", say: ["Hi Walter, thanks for making time. Just so you know, I'd like to record this for our review. Is that okay?"] },
      { title: "Terms", say: ["Quick check before we dive in. As we mentioned in our Indeed message, this is on site in Woodland Hills, Monday to Friday, nine to five, as a 1099 position at twenty to thirty an hour depending on experience. The role also includes driving to client sites around LA, and mileage is reimbursed. Is all of that still good for you?"] },
      { title: "If pay is a question", say: ["What rate within that range would you be looking for?"], note: "Never ask what he made before." },
      { title: "If travel is a question", say: ["Do you have reliable transportation to get to client sites around LA?"], note: "A clear no ends the call politely." },
      { title: "Start date", say: ["And if things move forward, when could you start?"], note: "He said he needs two weeks notice." },
      { title: "Work authorization", say: ["And are you legally authorized to work in the US, and will you now or in the future require visa sponsorship?"] },
      { title: "About us", say: ["Quick bit about us: Intelligent IT is a boutique managed IT company here in Woodland Hills, started in 2015 by Ryan and me, and we still run it. We're the IT department for small and mid-sized businesses around LA. We're small on purpose, so clients know us by name and stay with us about nine years on average. Okay, enough about us. Tell me about you."] },
      { title: "Their role", say: ["Walk me through your current role at Valley Community Healthcare. What does a typical day look like for you, and who are you usually helping?"] },
      { title: "Working with different clients", say: ["You've been supporting one organization on a three person team. Here you'd often help several different client companies in a day. How do you feel about that kind of switch?"] },
      { title: "Why looking", say: ["What's got you looking for something new right now?"] },
      { title: "Why this role", say: ["What made you apply for this role? And where would you like your career to be in two or three years?"] },
      { title: "Working with clients", say: ["An office manager calls, pretty upset. Email's been down for two hours, and it's the third problem this week. What do you say to her in the first minute?"] },
      { title: "Non-technical people", say: ["How do you explain a technical problem to someone who isn't technical, and just wants it fixed?"] },
      { title: "Troubleshooting", say: ["Tell me about a time something broke and you didn't know the answer right away. How did you figure it out?"] },
      { title: "Tools", say: ["What tools did you use day to day to help people? Things like tickets, Microsoft 365, remote support, or anything else. Which ones were you actually hands on with?"] },
      { title: "Culture", say: ["We're a small company, so you'd often be the person a client talks to, and there isn't a bigger team to hand the work to. How do you feel about that kind of setup?"] },
      { title: "When you're stuck", say: ["When you get stuck and there isn't someone next to you to take over, what do you usually do?"] },
      { title: "Certs", say: ["Almost done, just a quick wrap up. Do you have any certifications?"] },
      { title: "References", say: ["Could you reply in your Indeed message thread with one or two professional references, ideally a former manager or supervisor, with their name, the company, how you worked together, and a phone number or email? And are you okay with us contacting them?"] },
      { title: "Their questions", say: ["Before we wrap up, do you have any questions for us, or any concerns about the role?"], note: "If he asks whether this is contract to hire, do not invent an answer. Note the question." },
      { title: "Close", say: ["We review every call. If it's a fit, we'll reach out about next steps. Thanks so much for your time today, Walter."] },
    ],
  },
];

function PersonScript({ person }) {
  return (
    <div>
      <h2>{person.name}</h2>
      <p className="lede">{person.when}</p>
      <p className={person.id === "walter" ? "status-note ok" : "status-note wait"}>
        {person.facts[0][1]}
      </p>
      <dl className="props">
        {person.facts.slice(1).map(([label, value]) => (
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
        Monday Nov 9, 2026. People first scripts for the two calls. Say the lines in the boxes. Do not add questions.
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
      <h3>After the call</h3>
      {AFTER.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}
