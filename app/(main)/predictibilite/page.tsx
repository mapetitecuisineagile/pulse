"use client"
import { useState, useEffect } from 'react'

interface SprintMetrique {
  sprint: { id: string; label: string; quarter: string }
  targetSP: number
  addSP: number
  doneSP: number
  totalSP: number
  pred: number
  capaNette: number
  focusFactor: number
}

interface TeamDashboard {
  team: { id: string; name: string; slug: string; trigram: string }
  sprintEnCours: any
  sprintsTermines: SprintMetrique[]
  ffMoyen: number
  predMoyenne: number | null
}

export default function Predictibilite() {
  const [data, setData] = useState<TeamDashboard[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<string>('')

  useEffect(() => {
    fetch('/api/dashboard', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setData(d)
        if (d.length > 0) setSelectedTeam(d[0].team.slug)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <main><div style={{padding:'60px',textAlign:'center',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>CHARGEMENT...</div></main>
  )

  const teamData = data.find(d => d.team.slug === selectedTeam)
  if (!teamData) return null

  const { team, sprintsTermines, ffMoyen, predMoyenne } = teamData

  // Calcul stabilité
  const velocites = sprintsTermines.map(s => s.doneSP)
  const moyenne = velocites.length > 0 ? velocites.reduce((a, b) => a + b, 0) / velocites.length : 0
  const variance = velocites.length > 1
    ? velocites.reduce((acc, v) => acc + Math.pow(v - moyenne, 2), 0) / velocites.length
    : 0
  const ecartType = Math.sqrt(variance)
  const stabilite = moyenne > 0 ? Math.round((1 - ecartType / moyenne) * 100) / 100 : null

  // Dérive scope moyenne
  const deriveMoyenne = sprintsTermines.length > 0
    ? Math.round(sprintsTermines.reduce((acc, s) => acc + (s.totalSP > 0 ? s.addSP / s.targetSP * 100 : 0), 0) / sprintsTermines.length)
    : null

  return (
    <main>
      <div className="page-header">
        <div className="label">Analytics</div>
        <h1>Prédictibilité & <span>Stabilité</span></h1>
      </div>
      <div className="page-content">

        {/* Sélecteur équipe */}
        {data.length > 1 && (
          <div style={{marginBottom:'20px',maxWidth:'400px'}}>
            <label className="input-label">Équipe</label>
            <select className="input" value={selectedTeam}
              onChange={e => setSelectedTeam(e.target.value)}>
              {data.map(d => (
                <option key={d.team.slug} value={d.team.slug}>{d.team.name} ({d.team.trigram})</option>
              ))}
            </select>
          </div>
        )}

        {sprintsTermines.length === 0 ? (
          <div style={{padding:'60px',textAlign:'center',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>
            AUCUN SPRINT TERMINÉ — Terminez au moins un sprint pour voir les métriques
          </div>
        ) : (
          <>
            {/* KPI */}
            <div className="grid-4" style={{marginBottom:'24px'}}>
              <div className="kpi cyan">
                <div className="kpi-label">Prédictibilité moy.</div>
                <div className="kpi-value">{predMoyenne !== null ? `${predMoyenne}%` : '—'}</div>
                <div className="kpi-sub">
                  {predMoyenne !== null
                    ? predMoyenne >= 80 ? '✅ Bonne' : predMoyenne >= 60 ? '⚠️ Moyenne' : '❌ Faible'
                    : '—'}
                </div>
              </div>
              <div className="kpi green">
                <div className="kpi-label">Focus Factor moy.</div>
                <div className="kpi-value">{ffMoyen > 0 ? ffMoyen : '—'}</div>
                <div className="kpi-sub">SP done / capa</div>
              </div>
              <div className="kpi purple">
                <div className="kpi-label">Stabilité</div>
                <div className="kpi-value">{stabilite !== null ? stabilite : '—'}</div>
                <div className="kpi-sub">1 − (σ / μ) vélocité</div>
              </div>
              <div className="kpi yellow">
                <div className="kpi-label">Dérive scope moy.</div>
                <div className="kpi-value">{deriveMoyenne !== null ? `${deriveMoyenne}%` : '—'}</div>
                <div className="kpi-sub">Add ÷ Target</div>
              </div>
            </div>

            {/* Tableau multi-sprint */}
            <div className="card" style={{marginBottom:'20px'}}>
              <div className="card-head">
                <span className="label">Résultats par sprint — {team.name}</span>
                <span className="badge cyan">FF moy. {ffMoyen}</span>
              </div>
              <div style={{padding:'0'}}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Sprint</th>
                      <th>Capa nette</th>
                      <th>Target SP</th>
                      <th>Add</th>
                      <th>Total</th>
                      <th>Done SP</th>
                      <th>Préd. SP</th>
                      <th>Focus Factor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sprintsTermines.map(({ sprint, targetSP, addSP, doneSP, totalSP, pred, capaNette, focusFactor }) => (
                      <tr key={sprint.id}>
                        <td><span className="badge muted">{sprint.label}</span></td>
                        <td className="num">{Math.round(capaNette)}j</td>
                        <td className="num">{targetSP}</td>
                        <td className="num" style={{color:'var(--yellow)'}}>+{addSP}</td>
                        <td className="num">{totalSP}</td>
                        <td className="num" style={{color:'var(--green)'}}>{doneSP}</td>
                        <td>
                          <span className="badge" style={{
                            color: pred >= 80 ? 'var(--green)' : pred >= 60 ? 'var(--yellow)' : 'var(--red)',
                            background: pred >= 80 ? 'var(--green-dim)' : pred >= 60 ? 'var(--yellow-dim)' : 'var(--red-dim)',
                            borderColor: pred >= 80 ? 'var(--green-border)' : pred >= 60 ? 'var(--yellow-border)' : 'var(--red-border)',
                            borderRadius:'4px'
                          }}>{pred}%</span>
                        </td>
                        <td className="num" style={{color:'var(--cyan)'}}>{focusFactor}</td>
                      </tr>
                    ))}
                    <tr style={{borderTop:'2px solid var(--border-2)'}}>
                      <td style={{fontFamily:'DM Mono',fontSize:'10px',color:'var(--cyan)',fontWeight:700}}>TOTAL</td>
                      <td className="num">{Math.round(sprintsTermines.reduce((acc,s) => acc+s.capaNette, 0))}j</td>
                      <td className="num">{sprintsTermines.reduce((acc,s) => acc+s.targetSP, 0)}</td>
                      <td className="num" style={{color:'var(--yellow)'}}>+{sprintsTermines.reduce((acc,s) => acc+s.addSP, 0)}</td>
                      <td className="num">{sprintsTermines.reduce((acc,s) => acc+s.totalSP, 0)}</td>
                      <td className="num" style={{color:'var(--green)',fontWeight:700}}>{sprintsTermines.reduce((acc,s) => acc+s.doneSP, 0)}</td>
                      <td>
                        <span className="badge" style={{
                          color: predMoyenne !== null && predMoyenne >= 80 ? 'var(--green)' : predMoyenne !== null && predMoyenne >= 60 ? 'var(--yellow)' : 'var(--red)',
                          background: predMoyenne !== null && predMoyenne >= 80 ? 'var(--green-dim)' : predMoyenne !== null && predMoyenne >= 60 ? 'var(--yellow-dim)' : 'var(--red-dim)',
                          borderColor: predMoyenne !== null && predMoyenne >= 80 ? 'var(--green-border)' : predMoyenne !== null && predMoyenne >= 60 ? 'var(--yellow-border)' : 'var(--red-border)',
                          borderRadius:'4px'
                        }}>{predMoyenne}%</span>
                      </td>
                      <td className="num" style={{color:'var(--cyan)',fontWeight:700}}>{ffMoyen}</td>
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
                  <span className="badge purple">{sprintsTermines.length} sprints</span>
                </div>
                <div className="card-body">
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'16px'}}>
                    <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderLeft:'2px solid var(--green)',borderRadius:'8px',padding:'14px'}}>
                      <div className="label" style={{marginBottom:'4px'}}>Stabilité</div>
                      <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--green)'}}>{stabilite ?? '—'}</div>
                      <div className="label" style={{marginTop:'4px'}}>1 − (σ / μ)</div>
                    </div>
                    <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderLeft:'2px solid var(--yellow)',borderRadius:'8px',padding:'14px'}}>
                      <div className="label" style={{marginBottom:'4px'}}>Dérive scope</div>
                      <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--yellow)'}}>{deriveMoyenne !== null ? `${deriveMoyenne}%` : '—'}</div>
                      <div className="label" style={{marginTop:'4px'}}>Add ÷ Target moy.</div>
                    </div>
                    <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderLeft:'2px solid var(--cyan)',borderRadius:'8px',padding:'14px'}}>
                      <div className="label" style={{marginBottom:'4px'}}>Vélocité moy.</div>
                      <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--cyan)'}}>{Math.round(moyenne)}</div>
                      <div className="label" style={{marginTop:'4px'}}>SP done / sprint</div>
                    </div>
                    <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderLeft:'2px solid var(--purple)',borderRadius:'8px',padding:'14px'}}>
                      <div className="label" style={{marginBottom:'4px'}}>Écart-type</div>
                      <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--purple)'}}>{Math.round(ecartType * 10) / 10}</div>
                      <div className="label" style={{marginTop:'4px'}}>σ SP done</div>
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
                  {sprintsTermines.map(({ sprint, focusFactor }) => (
                    <div key={sprint.id} style={{marginBottom:'12px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                        <span className="label">{sprint.label}</span>
                        <span style={{fontFamily:'Space Mono',fontSize:'11px',color: focusFactor >= 1 ? 'var(--green)' : 'var(--cyan)'}}>{focusFactor}</span>
                      </div>
                      <div className="progress-track">
                        <div style={{height:'100%',width:`${Math.min(focusFactor * 80, 100)}%`,background: focusFactor >= 1 ? 'var(--green)' : 'var(--cyan)',borderRadius:'2px',transition:'width .3s'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </main>
  )
}