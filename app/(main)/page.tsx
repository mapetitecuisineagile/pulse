"use client"
import { useState, useEffect } from 'react'

interface SprintEnCours {
  id: string
  label: string
  quarter: string
  scopeTotal: number
  spRestants: number
  spDone: number
  pct: number
  jourCourant: number
  nbItems: number
}

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
  sprintEnCours: SprintEnCours | null
  sprintsTermines: SprintMetrique[]
  ffMoyen: number
  predMoyenne: number | null
}

export default function Dashboard() {
  const [data, setData] = useState<TeamDashboard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [])

  if (loading) return (
    <main><div style={{padding:'60px',textAlign:'center',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>CHARGEMENT...</div></main>
  )

  if (data.length === 0) return (
    <main>
      <div className="page-header">
        <div className="label">Dashboard</div>
        <h1>Delivery <span>Tracker</span></h1>
      </div>
      <div className="page-content">
        <div style={{textAlign:'center',padding:'60px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>
          AUCUNE ÉQUIPE — Créez votre première équipe dans /equipes
        </div>
      </div>
    </main>
  )

  return (
    <main>
      <div className="page-header">
        <div className="label">Dashboard — Vue globale</div>
        <h1>Delivery <span>Tracker</span></h1>
      </div>
      <div className="page-content">
        {data.map(({ team, sprintEnCours, sprintsTermines, ffMoyen, predMoyenne }) => (
          <div key={team.id} style={{marginBottom:'32px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
              <div style={{fontFamily:'DM Mono',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)'}}>
                {team.trigram}
              </div>
              <div style={{fontFamily:'Space Grotesk',fontSize:'18px',fontWeight:600,color:'var(--text)'}}>
                {team.name}
              </div>
              {sprintEnCours && (
                <span className="badge cyan">
                  <div className="pulse-dot" style={{width:'6px',height:'6px'}}></div>
                  {sprintEnCours.label} en cours
                </span>
              )}
            </div>

            <div className="grid-4" style={{marginBottom:'16px'}}>
              <div className="kpi cyan">
                <div className="kpi-label">Prédictibilité</div>
                <div className="kpi-value">{predMoyenne !== null ? `${predMoyenne}%` : '—'}</div>
                <div className="kpi-sub">{sprintsTermines.length} sprint{sprintsTermines.length > 1 ? 's' : ''} terminé{sprintsTermines.length > 1 ? 's' : ''}</div>
              </div>
              <div className="kpi green">
                <div className="kpi-label">Focus Factor</div>
                <div className="kpi-value">{ffMoyen > 0 ? ffMoyen : '—'}</div>
                <div className="kpi-sub">SP done / capa</div>
              </div>
              <div className="kpi purple">
                <div className="kpi-label">SP Done total</div>
                <div className="kpi-value">{sprintsTermines.reduce((acc, s) => acc + s.doneSP, 0)}</div>
                <div className="kpi-sub">tous sprints terminés</div>
              </div>
              <div className="kpi yellow">
                <div className="kpi-label">Sprints terminés</div>
                <div className="kpi-value">{sprintsTermines.length}</div>
                <div className="kpi-sub">avec données</div>
              </div>
            </div>

            {sprintEnCours && (
              <div className="grid-2" style={{marginBottom:'16px'}}>
                <div className="card card-accent-cyan">
                  <div className="card-head">
                    <span className="label">Sprint en cours</span>
                    <span className="badge cyan">
                      <div className="pulse-dot" style={{width:'6px',height:'6px'}}></div>
                      J{sprintEnCours.jourCourant} / 15
                    </span>
                  </div>
                  <div className="card-body">
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                      <div>
                        <div className="label" style={{marginBottom:'4px'}}>SP restants</div>
                        <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--cyan)'}}>{sprintEnCours.spRestants}</div>
                      </div>
                      <div>
                        <div className="label" style={{marginBottom:'4px'}}>SP done</div>
                        <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--green)'}}>{sprintEnCours.spDone}</div>
                      </div>
                      <div>
                        <div className="label" style={{marginBottom:'4px'}}>Avancement</div>
                        <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--yellow)'}}>{sprintEnCours.pct}%</div>
                      </div>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill-cyan" style={{width:`${sprintEnCours.pct}%`}}></div>
                    </div>
                    <div style={{marginTop:'12px'}}>
                      <a href={`/sprints/${sprintEnCours.id}`} className="btn btn-primary" style={{fontSize:'9px',padding:'6px 14px'}}>
                        Voir le burndown →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="card card-accent-green">
                  <div className="card-head">
                    <span className="label">Scope sprint</span>
                    <span className="badge green">{sprintEnCours.scopeTotal} SP engagés</span>
                  </div>
                  <div className="card-body">
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                      <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                        <div className="label" style={{marginBottom:'4px'}}>Items</div>
                        <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--purple)'}}>{sprintEnCours.nbItems}</div>
                      </div>
                      <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                        <div className="label" style={{marginBottom:'4px'}}>SP total</div>
                        <div style={{fontFamily:'Space Mono',fontSize:'22px',color:'var(--green)'}}>{sprintEnCours.scopeTotal}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {sprintsTermines.length > 0 && (
              <div className="card">
                <div className="card-head">
                  <span className="label">Sprints terminés — Résultats</span>
                  <span className="badge cyan">FF moy. {ffMoyen}</span>
                </div>
                <div style={{padding:'0'}}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Sprint</th>
                        <th>Target</th>
                        <th>Add</th>
                        <th>Done</th>
                        <th>Préd.</th>
                        <th>Focus Factor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sprintsTermines.map(({ sprint, targetSP, addSP, doneSP, pred, focusFactor }) => (
                        <tr key={sprint.id}>
                          <td><span className="badge muted">{sprint.label}</span></td>
                          <td className="num">{targetSP}</td>
                          <td className="num" style={{color:'var(--yellow)'}}>+{addSP}</td>
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
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {sprintsTermines.length === 0 && !sprintEnCours && (
              <div style={{padding:'24px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'8px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',textAlign:'center',letterSpacing:'1px'}}>
                Aucun sprint — créez un sprint dans /sprints
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}