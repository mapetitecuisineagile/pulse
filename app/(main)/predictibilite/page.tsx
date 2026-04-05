"use client"

export default function Predictibilite() {
  return (
    <main>
      <div className="page-header">
        <div className="label">Analytics — Q1 2026</div>
        <h1>Prédictibilité & <span>Stabilité</span></h1>
      </div>
      <div className="page-content">

        {/* KPI */}
        <div className="grid-4" style={{marginBottom:'24px'}}>
          <div className="kpi cyan">
            <div className="kpi-label">Préd. Scope Total</div>
            <div className="kpi-value">74%</div>
            <div className="kpi-sub">Moy. Q1 — ⚠️ 60-80%</div>
          </div>
          <div className="kpi green">
            <div className="kpi-label">Préd. Débit US</div>
            <div className="kpi-value">83%</div>
            <div className="kpi-sub">US done / engagées</div>
          </div>
          <div className="kpi purple">
            <div className="kpi-label">Stabilité</div>
            <div className="kpi-value">0.73</div>
            <div className="kpi-sub">1 − (σ / μ) SP done</div>
          </div>
          <div className="kpi yellow">
            <div className="kpi-label">Dérive scope moy.</div>
            <div className="kpi-value">28%</div>
            <div className="kpi-sub">Add ÷ Target moy.</div>
          </div>
        </div>

        {/* Tableau multi-sprint */}
        <div className="card" style={{marginBottom:'24px'}}>
          <div className="card-head">
            <span className="label">Résultats par sprint — Q1 2026</span>
            <span className="badge cyan">Focus Factor moy. 0.83</span>
          </div>
          <div className="card-body" style={{padding:'0'}}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sprint</th>
                  <th>Capa</th>
                  <th>Target SP</th>
                  <th>Add</th>
                  <th>Total</th>
                  <th>Done SP</th>
                  <th>Préd. SP</th>
                  <th>US eng.</th>
                  <th>US done</th>
                  <th>Préd. Débit</th>
                  <th>Focus Factor</th>
                  <th>Mood</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge muted">SP 1.1</span></td>
                  <td className="num">41j</td>
                  <td className="num">33</td>
                  <td className="num" style={{color:'var(--yellow)'}}>+8</td>
                  <td className="num">41</td>
                  <td className="num" style={{color:'var(--green)'}}>33</td>
                  <td><span className="badge" style={{color:'var(--green)',background:'var(--green-dim)',borderColor:'var(--green-border)',borderRadius:'4px'}}>80%</span></td>
                  <td className="num">12</td>
                  <td className="num" style={{color:'var(--green)'}}>10</td>
                  <td><span className="badge" style={{color:'var(--green)',background:'var(--green-dim)',borderColor:'var(--green-border)',borderRadius:'4px'}}>83%</span></td>
                  <td className="num">0.80</td>
                  <td className="num">—</td>
                </tr>
                <tr>
                  <td><span className="badge muted">SP 1.2</span></td>
                  <td className="num">55j</td>
                  <td className="num">54</td>
                  <td className="num" style={{color:'var(--yellow)'}}>+21</td>
                  <td className="num">75</td>
                  <td className="num" style={{color:'var(--green)'}}>45</td>
                  <td><span className="badge" style={{color:'var(--yellow)',background:'var(--yellow-dim)',borderColor:'var(--yellow-border)',borderRadius:'4px'}}>64%</span></td>
                  <td className="num">15</td>
                  <td className="num" style={{color:'var(--green)'}}>11</td>
                  <td><span className="badge" style={{color:'var(--yellow)',background:'var(--yellow-dim)',borderColor:'var(--yellow-border)',borderRadius:'4px'}}>73%</span></td>
                  <td className="num">0.82</td>
                  <td className="num">—</td>
                </tr>
                <tr>
                  <td><span className="badge muted">SP 1.3</span></td>
                  <td className="num">59j</td>
                  <td className="num">73</td>
                  <td className="num" style={{color:'var(--yellow)'}}>+39</td>
                  <td className="num">112</td>
                  <td className="num" style={{color:'var(--green)'}}>72</td>
                  <td><span className="badge" style={{color:'var(--yellow)',background:'var(--yellow-dim)',borderColor:'var(--yellow-border)',borderRadius:'4px'}}>71%</span></td>
                  <td className="num">18</td>
                  <td className="num" style={{color:'var(--green)'}}>16</td>
                  <td><span className="badge" style={{color:'var(--green)',background:'var(--green-dim)',borderColor:'var(--green-border)',borderRadius:'4px'}}>89%</span></td>
                  <td className="num">1.22</td>
                  <td className="num">—</td>
                </tr>
                <tr>
                  <td><span className="badge muted">SP 1.4</span></td>
                  <td className="num">60j</td>
                  <td className="num">94</td>
                  <td className="num" style={{color:'var(--yellow)'}}>+14</td>
                  <td className="num">108</td>
                  <td className="num" style={{color:'var(--green)'}}>72</td>
                  <td><span className="badge" style={{color:'var(--yellow)',background:'var(--yellow-dim)',borderColor:'var(--yellow-border)',borderRadius:'4px'}}>70%</span></td>
                  <td className="num">20</td>
                  <td className="num" style={{color:'var(--green)'}}>17</td>
                  <td><span className="badge" style={{color:'var(--green)',background:'var(--green-dim)',borderColor:'var(--green-border)',borderRadius:'4px'}}>85%</span></td>
                  <td className="num">1.20</td>
                  <td className="num">—</td>
                </tr>
                <tr style={{borderTop:'2px solid var(--border-2)'}}>
                  <td><strong style={{color:'var(--cyan)',fontFamily:'DM Mono',fontSize:'10px',letterSpacing:'1px'}}>TOTAL Q1</strong></td>
                  <td className="num">215j</td>
                  <td className="num">254</td>
                  <td className="num" style={{color:'var(--yellow)'}}>+82</td>
                  <td className="num">336</td>
                  <td className="num" style={{color:'var(--green)',fontWeight:700}}>222</td>
                  <td><span className="badge" style={{color:'var(--yellow)',background:'var(--yellow-dim)',borderColor:'var(--yellow-border)',borderRadius:'4px'}}>74%</span></td>
                  <td className="num">65</td>
                  <td className="num" style={{color:'var(--green)',fontWeight:700}}>54</td>
                  <td><span className="badge" style={{color:'var(--green)',background:'var(--green-dim)',borderColor:'var(--green-border)',borderRadius:'4px'}}>83%</span></td>
                  <td className="num" style={{color:'var(--cyan)'}}>0.83</td>
                  <td className="num">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stabilité */}
        <div className="grid-2">
          <div className="card card-accent-purple">
            <div className="card-head">
              <span className="label">Stabilité de la vélocité</span>
              <span className="badge purple">Q1 2026</span>
            </div>
            <div className="card-body">
              <div className="grid-2" style={{gap:'10px',marginBottom:'16px'}}>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderLeft:'2px solid var(--green)',borderRadius:'8px',padding:'14px'}}>
                  <div className="kpi-label">Stabilité</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'24px',color:'var(--green)'}}>0.73</div>
                  <div className="kpi-sub">1 − (σ / μ)</div>
                </div>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderLeft:'2px solid var(--yellow)',borderRadius:'8px',padding:'14px'}}>
                  <div className="kpi-label">Dérive scope</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'24px',color:'var(--yellow)'}}>28%</div>
                  <div className="kpi-sub">Add ÷ Target moy.</div>
                </div>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderLeft:'2px solid var(--cyan)',borderRadius:'8px',padding:'14px'}}>
                  <div className="kpi-label">Vélocité moy.</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'24px',color:'var(--cyan)'}}>55.5</div>
                  <div className="kpi-sub">SP done / sprint</div>
                </div>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderLeft:'2px solid var(--purple)',borderRadius:'8px',padding:'14px'}}>
                  <div className="kpi-label">Écart-type</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'24px',color:'var(--purple)'}}>15.2</div>
                  <div className="kpi-sub">σ SP done</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card card-accent-cyan">
            <div className="card-head">
              <span className="label">Focus Factor par sprint</span>
              <span className="badge cyan">Tendance</span>
            </div>
            <div className="card-body">
              {['SP 1.1','SP 1.2','SP 1.3','SP 1.4'].map((s,i)=>{
                const vals=[0.80,0.82,1.22,1.20]
                const colors=['var(--green)','var(--green)','var(--cyan)','var(--cyan)']
                const pcts=[65,67,100,98]
                return (
                  <div key={s} style={{marginBottom:'14px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'5px'}}>
                      <span className="label">{s}</span>
                      <span style={{fontFamily:'Space Mono',fontSize:'12px',color:colors[i]}}>{vals[i]}</span>
                    </div>
                    <div className="progress-track">
                      <div style={{height:'100%',width:`${pcts[i]}%`,background:colors[i],borderRadius:'2px',transition:'width .3s'}}></div>
                    </div>
                  </div>
                )
              })}
              <div style={{marginTop:'16px',padding:'10px 14px',background:'var(--cyan-dim)',border:'1px solid var(--cyan-border)',borderRadius:'8px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--cyan)'}}>
                ⓘ FF &gt; 1 sur S1.3 et S1.4 — vérifier si durées de sprint stables
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}