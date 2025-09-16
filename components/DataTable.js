export default function DataTable({ rows, columns, hrefBase }) {
  return (
    <div className="card" style={{overflowX:"auto"}}>
      <table className="table">
        <thead>
          <tr>{columns.map(c => <th key={c.key} className="th">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="row">
              {columns.map(c => (
                <td key={c.key} className="td">
                  {c.render ? c.render(r) : (c.key === "id" && hrefBase ? <a className="link" href={`${hrefBase}/${r.id}`}>Details</a> : String(r[c.key] ?? ""))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
