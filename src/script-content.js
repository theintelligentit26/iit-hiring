export const LOGI = [
  ["Start date and notice", "“When could you start, and how much notice do you owe your current job?”"],
  ["1099", "“This is a 1099 contractor role, so there are no benefits and you handle your own taxes. Are you OK with that?”"],
  ["Pay range", "“The pay is $20 to $30 an hour, depending on experience. Does that range work for you, and what rate in it are you looking for?” Do not ask what they made before."],
  ["City and commute", "“Which city do you live in, and is a daily commute to our office in Woodland Hills for a 9am start OK for you?”"],
  ["Reliable transport", "“Do you have reliable transportation, a valid driver’s license and your own auto insurance? Some client visits are a drive away, as far as San Clemente, and mileage is reimbursed.”"],
  ["Full 9 to 5", "“The role is on site Monday to Friday, 9am to 5pm. Are you available for the full schedule every week?”"],
];
export const TECH = [
  { q: "Walk me through your last support role. Who were the users, what did a normal day look like, and about how many tickets did you close a day?", area: "Hands-on support (30%)", good: "Specific users and sites, things they fixed with their own hands, realistic volume (about 10–30 a day), named tools.", red: "Only titles and buzzwords, no numbers, or “I managed the team” with no hands-on work." },
  { q: "A user says their PC is slow. Walk me through how you triage it.", area: "Core troubleshooting (20%)", good: "Asks since when and what changed, one PC or many; Task Manager (CPU, memory, disk), startup apps, free disk space, stuck updates; reboot.", red: "Jumps straight to reimaging or replacing the PC; asks the user nothing." },
  { q: "What ticketing system and RMM or remote tools have you used, and how did you keep several clients’ setups straight?", area: "MSP / RMM / ticketing (15%)", good: "Names tools (ConnectWise, Autotask, HaloPSA, NinjaOne, Datto, N-able, ScreenConnect); uses client docs (IT Glue, Hudu) and checks which client before acting.", red: "Can’t name a tool, never worked a ticket queue, or “I just remember it.”" },
  { q: "A new hire starts tomorrow. Walk me through setting them up in Active Directory or Entra ID, Microsoft 365 and Intune.", area: "AD / Entra / Intune (10%)", good: "Account by naming standard, groups, license, mailbox, MFA registration, device via Autopilot or Intune, apps and policies, test the first sign-in.", red: "No idea about licenses or groups, skips MFA, or shares an admin login with the user." },
  { q: "A manager needs access to a shared mailbox. How do you set it up, and how does it show up in Outlook?", area: "M365 / Exchange (core 20%)", good: "Exchange admin center: Full Access and Send As; automapping adds it to Outlook, which can take a while; tests it with the user.", red: "Shares the mailbox password, or makes the user an admin." },
  { q: "On a PC with no internet, how do you tell a DNS problem from a DHCP problem? And if a remote user can browse but can’t reach the shared drive, what do you check?", area: "Networking: DNS, DHCP, VPN (core 20%)", good: "ipconfig: a 169.254 address means DHCP; ping by IP works but by name fails means DNS; nslookup. Remote: is the VPN up, try the UNC path, access denied means permissions.", red: "Can’t explain the difference; “restart the router” is the only step." },
  { q: "The whole office can’t print to the shared copier, but it shows Ready on its panel. Where do you start?", area: "Printers (core 20%)", good: "Everyone is down, so check the printer and the network, not one PC: ping its IP, open its web page, check the print queue or spooler, check whether its IP changed.", red: "Reinstalls the driver on every PC first." },
  { q: "A user calls locked out and asks for a password reset. What do you do, and what if they’re locked out again ten minutes later?", area: "Account lockout (AD / Entra 10%)", good: "Verifies identity first (callback to a number on file, or the manager); unlocks or resets; then finds the source: old password saved on a phone, a mapped drive, an old session.", red: "Resets for anyone who asks; keeps unlocking without looking for the cause." },
  { q: "A user can’t get to their email. Walk me through it.", area: "Core troubleshooting (20%)", good: "Scopes it: does Outlook on the web work, one device or all, recent password change, MFA prompt, Microsoft service health, license, then the Outlook profile or cached credentials.", red: "Rebuilds the profile or resets the password first without checking the web." },
  { q: "A client’s CEO calls with an urgent problem while you have five other open tickets. How do you handle it?", area: "MSP / ticketing (15%)", good: "Triages by impact and urgency, acknowledges the CEO fast, updates the other tickets and sets expectations, asks the lead for help if needed.", red: "Drops everything with no notes, or ignores the exec, or rigid “first come, first served.”" },
  { q: "What goes into a good ticket note? Give me one for a password reset.", area: "Ticketing and documentation (15%)", good: "Symptom, how identity was verified, steps taken, result, user confirmed it works, any follow-up. Short and scannable.", red: "“Fixed.” Or writes the password in the ticket." },
  { q: "Tell me about a time you didn’t know the answer. What did you do?", area: "Verification and credibility (10%)", good: "Honest; checked docs or vendor support, asked a senior, kept the user updated, wrote down what they learned.", red: "Claims to always know, guessed on a live system, or blames others." },
];
export const SOFT = [
  { q: "A client’s office manager calls angry: email has been down for two hours and it’s the third problem this week. What do you say in the first minute, and what do you do next?", area: "Customer communication", good: "Stays calm, acknowledges the business impact, scopes it (one mailbox or everyone), gives a real callback time, keeps them updated, explains the fix in plain words.", red: "Argues, blames the user or Microsoft, gets defensive, or promises a fix time they can’t keep." },
  { q: "At an MSP you might work for four different client companies in one day. How do you keep it organized?", area: "Working across multiple clients", good: "Everything in tickets and time entries, client docs before acting, confirms which tenant or site they’re in, notes before switching.", red: "No system; mixes up passwords or settings between clients." },
  { q: "What have you taught yourself lately: a home lab, a cert or a course? How do you learn a tool you’ve never seen?", area: "Learning new tools", good: "Something specific and recent, hands-on; uses vendor docs and training, tests in a lab before production.", red: "Nothing since school, or vague answers with no example." },
];
export const DONT = [
  "Age, or anything that points at age (graduation years included)",
  "Marital status, kids, pregnancy or family plans",
  "Religion, national origin, citizenship or accent. You may ask only: are you legally authorized to work in the United States?",
  "Disability or medical history. You may describe the physical work and ask if they can do it.",
  "Arrests or convictions (California Fair Chance Act).",
  "Salary history (banned in California). Ask what they want for this role.",
];
export const AREAS = [
  ["Hands-on support", "Real desk-side and remote fixes, realistic volume"],
  ["Core troubleshooting", "Scopes first, logical order, safe steps"],
  ["MSP / RMM / ticketing", "Named tools, multi-client habits"],
  ["AD / Entra / Intune / M365", "Onboarding, MFA, mailboxes, devices"],
  ["Networking and printers", "DNS vs DHCP, VPN, printer triage"],
  ["Communication and customer care", "Calm, clear, sets expectations"],
  ["Logistics and pay fit", "9–5 on site, 1099, $20–30/hr, commute, transport"],
  ["Learning and ownership", "Honest about gaps, learns fast, documents"],
];
export const RUBRIC = [
  ["Hands-on paid support", "30%"],
  ["Core stack (Windows, M365, Entra, Azure, network)", "20%"],
  ["MSP / RMM / ticketing", "15%"],
  ["AD / Intune / Server", "10%"],
  ["Verification and credibility", "10%"],
  ["Role and pay fit (Level 1)", "10%"],
  ["Location / commute", "5%"],
  ["Cert bonus", "+0.1 per verified relevant cert, up to +0.3"],
];
export const QUICK_VIEW_URL = "https://cursor.com/canvas/store-6cb51f78-78d8-459a-91d8-e32022ca775c/a821151c-56d3-4912-922d-905a49a89130";
