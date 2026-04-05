"use client"
import { useState, useEffect } from 'react'

interface Team {
  id: string
  name: string
  slug: string
  trigram: string
}

interface Sprint {
  id: string
  label: string
  quarter: string
  startDate: string
  endDate: string
  status: string
  teamId: string
  items: any[]
  burndown: any[]
}

export default function Sprints() {
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    teamId: '', label: '', quarter: 'Q2-2026',
    startDate: '', endDate: '', sprintGoal: '', durationWeeks: 3
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/sprints', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/teams', { credentials: 'include' }).then(r => r.json()),
    ]).then(([s, t]) => {
      setSprints(s)
      setTeams(t)
      if (t.length > 0) setForm(f => ({ ...f, teamId: t[0].id }))
      setLoading(false)
    })
  }, [])

  async function createSprint() {
    const res = await fetch('/api/sprints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const sprint = await res.json()
      setSprints([sprint, ...sprints])
      setShowForm(false)
    }
  }

  async function deleteSprint(id: string, label: string) {
    if (!confirm(`Supprimer le sprint ${label} ?`)) return
    const res = await fetch(`/api/sprints/${id}`, { method: 'DELETE' })
    if (res.ok) setSprints(sprints.filter(s => s.id !== id))
  }

  async function changeStatus(id: string, status: string) {
    const res = await fetch(`/api/sprints/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) setSprints(sprints.map(s => s.id === id ? {...s, status} : s))
  }

  const statusColor: Record<string, string> = {
    planned: 'var(--muted)', active: 'var(--cyan)', done: 'var(--green)',
  }
  const statusLabel: Record<string, string> = {
    planned: 'Planifié', active: 'En cours', done: 'Terminé',
  }

  return (
    <main>
      <div className="page-header">
        <div className="label">Sprints</div>
        <h1>Sprints <span>en cours</span></h1>
      </div>
      <div className="page-content">

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <div className="label">{sprints.length} sprint{sprints.length > 1 ? 's' : ''}</div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Annuler' : '+ Nouveau sprint'}
          </button>
        </div>

        {showForm && (
          <div className="card card-accent-cyan" style={{marginBottom:'24px'}}>
            <div className="card-head"><span className="label">Créer un sprint</span></div>
            <div className="card-body">
              <div className="grid-2" style={{gap:'16px',marginBottom:'16px'}}>
                <div>
                  <label className="input-label">Équipe</label>
                  <select className="input" value={form.teamId}
                    onChange={e => setForm({...form, teamId: e.target.value})}>
                    {teams.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.trigram})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Label sprint</label>
                  <input className="input" placeholder="ex: Q2.S1"
                    value={form.label}
                    onChange={e => setForm({...form, label: e.target.value})}/>
                </div>
                <div>
                  <label className="input-label">Quarter</label>
                  <select className="input" value={form.quarter}
                    onChange={e => setForm({...form, quarter: e.target.value})}>
                    <option>Q1-2026</option>
                    <option>Q2-2026</option>
                    <option>Q3-2026</option>
                    <option>Q4-2026</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Durée</label>
                  <select className="input" value={form.durationWeeks}
                    onChange={e => setForm({...form, durationWeeks: parseInt(e.target.value)})}>
                    <option value={1}>1 semaine</option>
                    <option value={2}>2 semaines</option>
                    <option value={3}>3 semaines</option>
                    <option value={4}>4 semaines</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Date début</label>
                  <input className="input" type="date"
                    value={form.startDate}
                    onChange={e => setForm({...form, startDate: e.target.value})}/>
                </div>
                <div>
                  <label className="input-label">Date fin</label>
                  <input className="input" type="date"
                    value={form.endDate}
                    onChange={e => setForm({...form, endDate: e.target.value})}/>
                </div>
              </div>
              <div style={{marginBottom:'16px'}}>
                <label className="input-label">Sprint Goal (optionnel)</label>
                <input className="input" placeholder="Objectif du sprint..."
                  value={form.sprintGoal}
                  onChange={e => setForm({...form, sprintGoal: e.target.value})}/>
              </div>
              <button className="btn btn-primary" onClick={createSprint}
                disabled={!form.label || !form.startDate || !form.endDate}>
                Créer le sprint →
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div style={{textAlign:'center',padding:'60px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>CHARGEMENT...</div>
        )}

        {!loading && sprints.length === 0 && !showForm && (
          <div style={{textAlign:'center',padding:'60px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>
            AUCUN SPRINT — Créez votre premier sprint
          </div>
        )}

        <div className="grid-2">
          {sprints.map(sprint => {
            const team = teams.find(t => t.id === sprint.teamId)
            const start = new Date(sprint.startDate).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})
            const end = new Date(sprint.endDate).toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})
            return (
              <div key={sprint.id} className="card" style={{borderLeft:`2px solid ${statusColor[sprint.status]}`}}>
                <div className="card-head">
                  <div>
                    <div className="label" style={{marginBottom:'4px'}}>{team?.trigram} — {sprint.quarter}</div>
                    <div style={{fontFamily:'Space Grotesk',fontSize:'16px',fontWeight:600,color:'var(--text)'}}>{sprint.label}</div>
                  </div>
                  <span className="badge" style={{color:statusColor[sprint.status],background:`${statusColor[sprint.status]}15`,borderColor:`${statusColor[sprint.status]}40`}}>
                    {sprint.status === 'active' && <span style={{display:'inline-block',width:'6px',height:'6px',borderRadius:'50%',background:'var(--cyan)',marginRight:'5px',verticalAlign:'middle'}}></span>}
                    {statusLabel[sprint.status]}
                  </span>
                </div>
                <div className="card-body">
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'12px'}}>
                    <div>
                      <div className="label" style={{marginBottom:'4px'}}>Dates</div>
                      <div style={{fontFamily:'Space Mono',fontSize:'12px',color:'var(--text)'}}>{start} → {end}</div>
                    </div>
                    <div>
                      <div className="label" style={{marginBottom:'4px'}}>Items</div>
                      <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--cyan)'}}>{sprint.items.length}</div>
                    </div>
                    <div>
                      <div className="label" style={{marginBottom:'4px'}}>Burndown</div>
                      <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--purple)'}}>{sprint.burndown.length}j</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:'8px'}}>
                    {sprint.status === 'planned' && (
                      <button
                        onClick={() => changeStatus(sprint.id, 'active')}
                        style={{background:'var(--cyan-dim)',border:'1px solid var(--cyan-border)',borderRadius:'7px',padding:'10px 14px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--cyan)',cursor:'pointer'}}>
                        ▶ Démarrer
                      </button>
                    )}
                    {sprint.status === 'active' && (
                      <button
                        onClick={() => changeStatus(sprint.id, 'done')}
                        style={{background:'var(--green-dim)',border:'1px solid var(--green-border)',borderRadius:'7px',padding:'10px 14px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--green)',cursor:'pointer'}}>
                        ✓ Terminer
                      </button>
                    )}
                    <a href={`/sprints/${sprint.id}`} className="btn btn-primary" style={{flex:1,justifyContent:'center'}}>
                      Voir le burndown →
                    </a>
                    <button
                      onClick={() => deleteSprint(sprint.id, sprint.label)}
                      style={{background:'var(--red-dim)',border:'1px solid var(--red-border)',borderRadius:'7px',padding:'10px 14px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--red)',cursor:'pointer'}}>
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {!showForm && (
            <div className="card" onClick={() => setShowForm(true)}
              style={{border:'1px dashed var(--border-2)',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'160px',cursor:'pointer'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'32px',marginBottom:'12px',color:'var(--border-2)'}}>+</div>
                <div className="label">Nouveau sprint</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}