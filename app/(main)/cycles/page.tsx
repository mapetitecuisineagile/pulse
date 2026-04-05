"use client"

export default function Cycles() {
  return (
    <main>
      <div className="page-header">
        <div className="label">Projection quarterly</div>
        <h1>Cycles & <span>Hypothèses</span></h1>
      </div>
      <div className="page-content">

        {/* Timeline quarters */}
        <div style={{display:'flex',alignItems:'center',gap:'0',marginBottom:'32px'}}>
          {['Q1','Q2','Q3','Q4'].map((q,i)=>{
            const status = i===0?'done':i===1?'active':'plan'
            const colors:Record<string,string> = {done:'var(--green)',active:'var(--cyan)',plan:'var(--muted)'}
            const labels:Record<string,string> = {done:'Terminé',active:'En cours',plan:'Planifié'}
            return (
              <div key={q} style={{display:'flex',alignItems:'center',flex:1}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'}}>
                  <div style={{
                    width:'44px',height:'44px',borderRadius:'50%',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontFamily:'DM Mono',fontSize:'13px',fontWeight:500,
                    border:`1px solid ${colors[status]}`,
                    color:colors[status],
                    background:status==='active'?'rgba(0,212,255,0.1)':status==='done'?'rgba(0,255,157,0.1)':'transparent',
                    boxShadow:status==='active'?'0 0 0 4px rgba(0,212,255,0.1)':'none',
                  }}>{q}</div>
                  <div style={{fontFamily:'DM Mono',fontSize:'8px',letterSpacing:'1px',color:colors[status]}}>{labels[status]}</div>
                </div>
                {i<3 && <div style={{flex:1,height:'1px',background:i===0?'rgba(0,255,157,0.3)':'var(--border)',margin:'0 8px',marginBottom:'20px'}}></div>}
              </div>
            )
          })}
        </div>

        {/* Q1 — Cycle référence */}
        <div className="card" style={{marginBottom:'16px',borderLeft:'2px solid var(--green)'}}>
          <div className="card-head">
            <div>
              <div className="label" style={{marginBottom:'4px'}}>Cycle référence</div>
              <div style={{fontFamily:'Space Grotesk',fontSize:'18px',fontWeight:600}}>Q1 2026 — Terminé</div>
            </div>
            <span className="badge green">✅ Terminé</span>
          </div>
          <div className="card-body">
            <div className="grid-4" style={{marginBottom:'20px'}}>
              <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'14px'}}>
                <div className="label" style={{marginBottom:'4px'}}>Capa réelle</div>
                <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--cyan)'}}>215j</div>
              </div>
              <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'14px'}}>
                <div className="label" style={{marginBottom:'4px'}}>SP Done</div>
                <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--green)'}}>222</div>
              </div>
              <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'14px'}}>
                <div className="label" style={{marginBottom:'4px'}}>US Done</div>
                <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--purple)'}}>54</div>
              </div>
              <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'14px'}}>
                <div className="label" style={{marginBottom:'4px'}}>Focus Factor</div>
                <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--yellow)'}}>0.83</div>
              </div>
            </div>

            {/* Ratios */}
            <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'16px'}}>
              <div className="label" style={{marginBottom:'12px'}}>Ratios de performance</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}>
                <div>
                  <div className="label" style={{marginBottom:'4px'}}>Focus Factor</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'16px',color:'var(--cyan)'}}>222 ÷ 215 = <strong style={{color:'var(--yellow)'}}>0.83</strong></div>
                </div>
                <div>
                  <div className="label" style={{marginBottom:'4px'}}>Ratio US/Capa</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'16px',color:'var(--cyan)'}}>54 ÷ 215 = <strong style={{color:'var(--purple)'}}>0.25</strong></div>
                </div>
                <div>
                  <div className="label" style={{marginBottom:'4px'}}>Préd. moy.</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'16px',color:'var(--cyan)'}}>moy. = <strong style={{color:'var(--yellow)'}}>74%</strong></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Q2 — Hypothèses */}
        <div className="card" style={{marginBottom:'16px',borderLeft:'2px solid var(--cyan)'}}>
          <div className="card-head">
            <div>
              <div className="label" style={{marginBottom:'4px'}}>Cycle en cours</div>
              <div style={{fontFamily:'Space Grotesk',fontSize:'18px',fontWeight:600}}>Q2 2026 — En cours</div>
            </div>
            <div style={{display:'flex',gap:'8px'}}>
              <span className="badge cyan">
                <div className="pulse-dot" style={{width:'6px',height:'6px'}}></div>
                En cours
              </span>
            </div>
          </div>
          <div className="card-body">

            {/* Hypothèse globale */}
            <div style={{background:'var(--cyan-dim)',border:'1px solid var(--cyan-border)',borderRadius:'10px',padding:'20px',marginBottom:'20px'}}>
              <div className="label" style={{marginBottom:'8px',color:'var(--cyan)'}}>Hypothèse engagement Q2</div>
              <div style={{display:'flex',alignItems:'baseline',gap:'16px',marginBottom:'8px'}}>
                <div style={{fontFamily:'Space Mono',fontSize:'36px',fontWeight:700,color:'var(--cyan)'}}>210 SP</div>
                <div style={{fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)'}}>253j × 0.83 FF</div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
                <div>
                  <div className="label" style={{marginBottom:'2px'}}>dont BAU</div>
                  <div style={{fontFamily:'Space Mono',color:'var(--yellow)'}}>63 SP</div>
                </div>
                <div>
                  <div className="label" style={{marginBottom:'2px'}}>dont Produit</div>
                  <div style={{fontFamily:'Space Mono',color:'var(--green)'}}>147 SP</div>
                </div>
                <div>
                  <div className="label" style={{marginBottom:'2px'}}>US hypothèse</div>
                  <div style={{fontFamily:'Space Mono',color:'var(--purple)'}}>63 US</div>
                </div>
                <div>
                  <div className="label" style={{marginBottom:'2px'}}>SP / sprint</div>
                  <div style={{fontFamily:'Space Mono',color:'var(--cyan)'}}>52 SP</div>
                </div>
              </div>
            </div>

            {/* Tableau par sprint */}
            <table className="data-table">
              <thead>
                <tr>
                  <th>Sprint</th>
                  <th>Dates</th>
                  <th>Capa prévue</th>
                  <th>SP hypothèse</th>
                  <th>dont BAU</th>
                  <th>SP réels</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge cyan">Q2.S1</span></td>
                  <td style={{fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)'}}>24/03 → 11/04</td>
                  <td className="num">63j</td>
                  <td className="num" style={{color:'var(--cyan)'}}>52</td>
                  <td className="num" style={{color:'var(--yellow)'}}>16</td>
                  <td className="num" style={{color:'var(--green)'}}>20 <span style={{fontSize:'9px',color:'var(--muted)'}}>en cours</span></td>
                  <td><span className="badge cyan"><div className="pulse-dot" style={{width:'5px',height:'5px'}}></div>En cours</span></td>
                </tr>
                <tr>
                  <td><span className="badge muted">Q2.S2</span></td>
                  <td style={{fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)'}}>14/04 → 02/05</td>
                  <td className="num">65j</td>
                  <td className="num" style={{color:'var(--muted)'}}>54</td>
                  <td className="num" style={{color:'var(--muted)'}}>16</td>
                  <td className="num" style={{color:'var(--muted)'}}>—</td>
                  <td><span className="badge muted">Planifié</span></td>
                </tr>
                <tr>
                  <td><span className="badge muted">Q2.S3</span></td>
                  <td style={{fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)'}}>05/05 → 23/05</td>
                  <td className="num">63j</td>
                  <td className="num" style={{color:'var(--muted)'}}>52</td>
                  <td className="num" style={{color:'var(--muted)'}}>16</td>
                  <td className="num" style={{color:'var(--muted)'}}>—</td>
                  <td><span className="badge muted">Planifié</span></td>
                </tr>
                <tr>
                  <td><span className="badge muted">Q2.S4</span></td>
                  <td style={{fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)'}}>26/05 → 13/06</td>
                  <td className="num">62j</td>
                  <td className="num" style={{color:'var(--muted)'}}>52</td>
                  <td className="num" style={{color:'var(--muted)'}}>16</td>
                  <td className="num" style={{color:'var(--muted)'}}>—</td>
                  <td><span className="badge muted">Planifié</span></td>
                </tr>
              </tbody>
            </table>

            <div className="warning-banner" style={{marginTop:'16px'}}>
              ⚠️ Hypothèses basées sur le Focus Factor Q1 (0.83) — fiables uniquement si durées de sprint stables
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}