"use client"
import { useState, useEffect } from 'react'

interface Team {
  id: string
  name: string
  slug: string
  trigram: string
  color: string
  members: any[]
  sprintDurationWeeks: number
  pctBau: number
}

export default function Equipes() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', trigram: '', color: '#00d4ff', description: ''
  })

  useEffect(() => {
    fetch('/api/teams')
      .then(r => r.json())
      .then(data => { setTeams(data); setLoading(false) })
  }, [])

  async function createTeam() {
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const team = await res.json()
      setTeams([...teams, team])
      setShowForm(false)
      setForm({ name: '', slug: '', trigram: '', color: '#00d4ff', description: '' })
    }
  }

  return (
    <main>
      <div className="page-header">
        <div className="label">Gestion des équipes</div>
        <h1>Équipes & <span>Membres</span></h1>
      </div>
      <div className="page-content">

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <div className="label">{teams.length} équipe{teams.length > 1 ? 's' : ''} active{teams.length > 1 ? 's' : ''}</div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Annuler' : '+ Nouvelle équipe'}
          </button>
        </div>

        {showForm && (
          <div className="card card-accent-cyan" style={{marginBottom:'24px'}}>
            <div className="card-head">
              <span className="label">Créer une équipe</span>
            </div>
            <div className="card-body">
              <div className="grid-2" style={{gap:'16px',marginBottom:'16px'}}>
                <div>
                  <label className="input-label">Nom de l'équipe</label>
                  <input className="input" placeholder="Ex: Équipe Technique"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}/>
                </div>
                <div>
                  <label className="input-label">Slug (URL)</label>
                  <input className="input" placeholder="ex: equipe-technique"
                    value={form.slug}
                    onChange={e => setForm({...form, slug: e.target.value.toLowerCase().replace(/\s+/g,'-')})}/>
                </div>
                <div>
                  <label className="input-label">Trigramme</label>
                  <input className="input" placeholder="ex: E.T" maxLength={5}
                    value={form.trigram}
                    onChange={e => setForm({...form, trigram: e.target.value})}/>
                </div>
                <div>
                  <label className="input-label">Couleur</label>
                  <input className="input" type="color"
                    value={form.color}
                    onChange={e => setForm({...form, color: e.target.value})}
                    style={{height:'44px',padding:'4px'}}/>
                </div>
              </div>
              <div style={{marginBottom:'16px'}}>
                <label className="input-label">Description (optionnel)</label>
                <input className="input" placeholder="Description de l'équipe"
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}/>
              </div>
              <button className="btn btn-primary" onClick={createTeam}
                disabled={!form.name || !form.slug || !form.trigram}>
                Créer l'équipe →
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div style={{textAlign:'center',padding:'60px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>
            CHARGEMENT...
          </div>
        )}

        {!loading && teams.length === 0 && !showForm && (
          <div style={{textAlign:'center',padding:'60px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>
            AUCUNE ÉQUIPE — Créez votre première équipe
          </div>
        )}

        <div className="grid-3">
          {teams.map(team => (
            <div key={team.id} className="card" style={{borderLeft:`2px solid ${team.color}`}}>
              <div className="card-head">
                <div>
                  <div className="label" style={{marginBottom:'4px'}}>{team.trigram}</div>
                  <div style={{fontFamily:'Space Grotesk',fontSize:'16px',fontWeight:600,color:'var(--text)'}}>{team.name}</div>
                </div>
                <span className="badge green">Active</span>
              </div>
              <div className="card-body">
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
                  <div>
                    <div className="label" style={{marginBottom:'4px'}}>Membres</div>
                    <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--cyan)'}}>{team.members.length}</div>
                  </div>
                  <div>
                    <div className="label" style={{marginBottom:'4px'}}>Sprint</div>
                    <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--purple)'}}>{team.sprintDurationWeeks} sem.</div>
                  </div>
                  <div>
                    <div className="label" style={{marginBottom:'4px'}}>% BAU</div>
                    <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--yellow)'}}>{Math.round(team.pctBau*100)}%</div>
                  </div>
                </div>
                <a href={`/equipes/${team.slug}`} className="btn btn-primary" style={{width:'100%',justifyContent:'center',display:'flex'}}>
                  Voir l'équipe →
                </a>
              </div>
            </div>
          ))}

          {!showForm && (
            <div className="card" onClick={() => setShowForm(true)}
              style={{border:'1px dashed var(--border-2)',display:'flex',alignItems:'center',justifyContent:'center',minHeight:'200px',cursor:'pointer'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:'32px',marginBottom:'12px',color:'var(--border-2)'}}>+</div>
                <div className="label">Nouvelle équipe</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}