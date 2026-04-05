export default function Dashboard() {
  return (
    <main>
      <div className="page-header">
        <div className="label">Dashboard — Q2 2026</div>
        <h1>Delivery <span>Tracker</span></h1>
      </div>
      <div className="page-content">
        <div className="grid-4" style={{marginBottom:'24px'}}>
          <div className="kpi cyan">
            <div className="kpi-label">Prédictibilité</div>
            <div className="kpi-value">74%</div>
            <div className="kpi-sub">Scope total Q1</div>
          </div>
          <div className="kpi green">
            <div className="kpi-label">Focus Factor</div>
            <div className="kpi-value">0.83</div>
            <div className="kpi-sub">SP done / capa</div>
          </div>
          <div className="kpi purple">
            <div className="kpi-label">SP Done Q1</div>
            <div className="kpi-value">235</div>
            <div className="kpi-sub">sur 316 engagés</div>
          </div>
          <div className="kpi yellow">
            <div className="kpi-label">Capacité Q2</div>
            <div className="kpi-value">253j</div>
            <div className="kpi-sub">Hypothèse : 210 SP</div>
          </div>
        </div>
        <div className="warning-banner" style={{marginBottom:'24px'}}>
          ⚠️ Basé sur le Focus Factor Q1 — durées de sprint stables requises
        </div>
        <div className="card">
          <div className="card-head">
            <span className="label">Sprints Q1 2026</span>
          </div>
          <div className="card-body" style={{padding:'0'}}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sprint</th>
                  <th>Capacité</th>
                  <th>Target</th>
                  <th>Done</th>
                  <th>Prédictibilité</th>
                  <th>Focus Factor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge muted">SP 1.1</span></td>
                  <td className="num">41j</td>
                  <td className="num">33</td>
                  <td className="num" style={{color:'var(--green)'}}>33</td>
                  <td><span className="badge" style={{color:'var(--green)',background:'var(--green-dim)',borderColor:'var(--green-border)'}}>80%</span></td>
                  <td className="num">0.80</td>
                </tr>
                <tr>
                  <td><span className="badge muted">SP 1.2</span></td>
                  <td className="num">55j</td>
                  <td className="num">54</td>
                  <td className="num" style={{color:'var(--green)'}}>45</td>
                  <td><span className="badge" style={{color:'var(--yellow)',background:'var(--yellow-dim)',borderColor:'var(--yellow-border)'}}>64%</span></td>
                  <td className="num">0.82</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}