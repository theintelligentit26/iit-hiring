const STATUS_CLASS = {
  requested: "st-requested",
  confirmed: "st-confirmed",
  done: "st-done",
  "no-show": "st-no-show",
  cancelled: "st-cancelled",
};

function textOrDash(value) {
  let text = typeof value === "string" ? value.trim() : "";
  return text || "—";
}

function slotLabel(value) {
  if (!value) return "not set";
  let date = new Date(value);
  if (Number.isNaN(date.getTime())) return "not set";
  return `${new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  }).format(date)} PT`;
}

function questionsNotes(row) {
  let parts = [row.questions, row.notes]
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
  return parts.join("\n\n") || "—";
}

export function ScheduleTab({ rows, phase, scoreFor }) {
  return (
    <div role="tabpanel" id="panel-schedule" aria-labelledby="tab-sched">
      <h1>Interview schedule</h1>
      <p className="lede">
        Requested times and confirmed slots. A confirmed slot is shown in
        Pacific time, or “not set” until one is booked.
      </p>
      {phase === "loading" ? (
        <p className="empty">Loading the interview schedule…</p>
      ) : rows.length === 0 ? (
        <p className="empty">No interviews are on the schedule yet.</p>
      ) : (
        <div className="sched-scroll">
          <table className="sched-table">
            <caption>Interview schedule</caption>
            <thead>
              <tr>
                <th className="name" scope="col">
                  Name
                </th>
                <th scope="col">Requested</th>
                <th scope="col">Confirmed slot</th>
                <th scope="col">Status</th>
                <th scope="col">Notice</th>
                <th scope="col">Pay</th>
                <th scope="col">Location</th>
                <th scope="col">Questions/notes</th>
                <th className="score" scope="col">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <td className="name">{row.name}</td>
                  <td>{textOrDash(row.requested)}</td>
                  <td>{slotLabel(row.scheduled_at)}</td>
                  <td>
                    <span
                      className={`pill ${STATUS_CLASS[row.status] || "st-requested"}`}
                    >
                      {row.status || "—"}
                    </span>
                  </td>
                  <td>{textOrDash(row.notice)}</td>
                  <td>{textOrDash(row.pay_note)}</td>
                  <td>{textOrDash(row.location_note)}</td>
                  <td className="qnotes">{questionsNotes(row)}</td>
                  <td className="score">{scoreFor(row.name)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
