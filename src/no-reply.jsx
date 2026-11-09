function batchLabel(reason) {
  let text = typeof reason === "string" ? reason.toLowerCase() : "";
  if (text.includes("batch 1 or 2")) return "Batch 1 or 2";
  return "Not stated";
}

export function NoReplyTab({ rows, phase }) {
  return (
    <div role="tabpanel" id="panel-noreply" aria-labelledby="tab-noreply">
      <h1>No reply</h1>
      <p className="lede">
        Invited in batch 1 or 2 and no reply as of Nov 9. They are not on the main list.
      </p>
      {phase === "loading" ? (
        <p className="empty">Loading the no reply list…</p>
      ) : rows.length === 0 ? (
        <p className="empty">No one is on this list yet.</p>
      ) : (
        rows.map((row) => (
          <article className="card" key={row.name} id={`noreply-${row.name.replace(/[^A-Za-z0-9]+/g, "-")}`}>
            <h2>
              {row.rank}. {row.name}
            </h2>
            <div className="card-body">
              <dl className="props">
                <div>
                  <dt>Score</dt>
                  <dd>{row.s10 || "Not stated"}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{row.loc || "Not stated"}</dd>
                </div>
                <div>
                  <dt>Batch</dt>
                  <dd>{batchLabel(row.movedReason)}</dd>
                </div>
                <div>
                  <dt>Reason</dt>
                  <dd>Invited, no reply as of Nov 9</dd>
                </div>
              </dl>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
