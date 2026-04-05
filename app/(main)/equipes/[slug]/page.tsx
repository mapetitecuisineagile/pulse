"use client"
import { useState, useEffect, use } from 'react'

interface Member {
  id: string
  firstName: string
  lastName: string
  role: string
  fte: number
  countsInCapacity: boolean
  status: string
}

interface Team {
  id: string
  name: string
  slug: string
  trigram: string
  color: string
  sprintDurationWeeks: number
  pctBau: number
  pctRisk: number
  pctCerem: number
  pctOther: number
  predMode: string
  members: Member[]
}

export default function EquipeDetail({ params }: { params: any }) {
  const resolvedParams = use(params)
  const slug = (resolvedParams as { slug: string }).slug
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingMember, setEditingMember] = useState<string | null>(null)
  const [editMemberForm, setEditMemberForm] = useState({
    firstName: '', lastName: '', role: 'Dev', fte: 1.0, countsInCapacity: true
  })
  const [form, setForm] = useState({
    firstName: '', lastName: '', role: 'Dev', fte: 1.0, countsInCapacity: true
  })

  useEffect(() => {
    fetch('/api/teams', { credentials: 'include' })
      .then(r => r.json())
      .then((teams: Team[]) => {
        const found = teams.find(t => t.slug === slug)
        setTeam(found || null)
        setLoading(false)
      })
  }, [slug])

  async function addMember() {
    if (!team) return
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, teamId: team.id }),
    })
    if (res.ok) {
      const member = await res.json()
      setTeam({ ...team, members: [...team.members, member] })
      setShowForm(false)
      setForm({ firstName: '', lastName: '', role: 'Dev', fte: 1.0, countsInCapacity: true })
    }
  }

  async function saveMember(memberId: string) {
    const res = await fetch(`/api/members/${memberId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editMemberForm),
    })
    if (res.ok) {
      const updated = await res.json()
      setTeam({...team!, members: team!.members.map(m => m.id === memberId ? {...m, ...updated} : m)})
      setEditingMember(null)
    }
  }

  async function deactivateMember(memberId: string, name: string) {
    if (!confirm(`Désactiver ${name} ?`)) return
    const res = await fetch(`/api/members/${memberId}`, { method: 'DELETE' })
    if (res.ok) {
      setTeam({...team!, members: team!.members.map(m => m.id === memberId ? {...m, status: 'inactive'} : m)})
    }
  }

  if (loading) return (
    <main><div style={{padding:'60px',textAlign:'center',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>CHARGEMENT...</div></main>
  )

  if (!team) return (
    <main><div style={{padding:'60px',textAlign:'center',fontFamily:'DM Mono',fontSize:'10px',color:'var(--red)',letterSpacing:'2px'}}>ÉQUIPE INTROUVABLE</div></main>
  )

  const capaDevs = team.members.filter(m => m.countsInCapacity && m.status === 'active')
  const totalFte = capaDevs.reduce((acc, m) => acc + m.fte, 0)
  const pctProduit = Math.round((1 - team.pctBau - team.pctRisk - team.pctCerem - team.pctOther) * 100)

  return (
    <main>
      <div className="page-header">
        <div className="label">Équipe — {team.trigram}</div>
        <h1>{team.name} <span style={{color:team.color}}>{team.trigram}</span></h1>
      </div>
      <div className="page-content">

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'24px'}}>
          <div className="label">{team.members.filter(m=>m.status==='active').length} membre{team.members.length > 1 ? 's' : ''} actif{team.members.length > 1 ? 's' : ''} — {totalFte} FTE en capacité</div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? '✕ Annuler' : '+ Ajouter un membre'}
          </button>
        </div>

        {showForm && (
          <div className="card card-accent-cyan" style={{marginBottom:'24px'}}>
            <div className="card-head"><span className="label">Ajouter un membre</span></div>
            <div className="card-body">
              <div className="grid-2" style={{gap:'16px',marginBottom:'16px'}}>
                <div>
                  <label className="input-label">Prénom</label>
                  <input className="input" placeholder="Prénom"
                    value={form.firstName}
                    onChange={e => setForm({...form, firstName: e.target.value})}/>
                </div>
                <div>
                  <label className="input-label">Nom</label>
                  <input className="input" placeholder="Nom"
                    value={form.lastName}
                    onChange={e => setForm({...form, lastName: e.target.value})}/>
                </div>
                <div>
                  <label className="input-label">Rôle</label>
                  <select className="input" value={form.role}
                    onChange={e => setForm({...form, role: e.target.value})}>
                    <option>Dev</option>
                    <option>Lead</option>
                    <option>QA</option>
                    <option>PO</option>
                    <option>Architecte</option>
                    <option>DevOps</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">FTE</label>
                  <select className="input" value={form.fte}
                    onChange={e => setForm({...form, fte: parseFloat(e.target.value)})}>
                    <option value={0.25}>0.25</option>
                    <option value={0.5}>0.5</option>
                    <option value={0.75}>0.75</option>
                    <option value={1.0}>1.0</option>
                  </select>
                </div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
                <input type="checkbox" checked={form.countsInCapacity}
                  onChange={e => setForm({...form, countsInCapacity: e.target.checked})}
                  style={{width:'16px',height:'16px',accentColor:'var(--cyan)'}}/>
                <label style={{fontFamily:'DM Mono',fontSize:'10px',letterSpacing:'1px',color:'var(--subtle)'}}>
                  Compte dans la capacité (Dev = OUI, PO = NON)
                </label>
              </div>
              <button className="btn btn-primary" onClick={addMember}
                disabled={!form.firstName || !form.lastName}>
                Ajouter →
              </button>
            </div>
          </div>
        )}

        <div className="card" style={{marginBottom:'16px'}}>
          <div className="card-head">
            <span className="label">Membres de l'équipe</span>
            <span className="badge cyan">{capaDevs.length} en capacité</span>
          </div>
          <div className="card-body" style={{padding:'0'}}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th><th>Rôle</th><th>FTE</th><th>Capacité</th><th>Statut</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {team.members.length === 0 && (
                  <tr><td colSpan={6} style={{textAlign:'center',padding:'24px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)'}}>Aucun membre</td></tr>
                )}
                {team.members.map(m => (
                  editingMember === m.id ? (
                    <tr key={m.id} style={{background:'var(--surface-2)'}}>
                      <td>
                        <div style={{display:'flex',gap:'6px'}}>
                          <input className="input" value={editMemberForm.firstName}
                            onChange={e => setEditMemberForm({...editMemberForm, firstName: e.target.value})}
                            style={{padding:'4px 8px',fontSize:'10px',width:'80px'}}/>
                          <input className="input" value={editMemberForm.lastName}
                            onChange={e => setEditMemberForm({...editMemberForm, lastName: e.target.value})}
                            style={{padding:'4px 8px',fontSize:'10px',width:'80px'}}/>
                        </div>
                      </td>
                      <td>
                        <select className="input" value={editMemberForm.role}
                          onChange={e => setEditMemberForm({...editMemberForm, role: e.target.value})}
                          style={{padding:'4px 8px',fontSize:'10px'}}>
                          <option>Dev</option>
                          <option>Lead</option>
                          <option>QA</option>
                          <option>PO</option>
                          <option>Architecte</option>
                          <option>DevOps</option>
                        </select>
                      </td>
                      <td>
                        <select className="input" value={editMemberForm.fte}
                          onChange={e => setEditMemberForm({...editMemberForm, fte: parseFloat(e.target.value)})}
                          style={{padding:'4px 8px',fontSize:'10px'}}>
                          <option value={0.25}>0.25</option>
                          <option value={0.5}>0.5</option>
                          <option value={0.75}>0.75</option>
                          <option value={1.0}>1.0</option>
                        </select>
                      </td>
                      <td>
                        <input type="checkbox" checked={editMemberForm.countsInCapacity}
                          onChange={e => setEditMemberForm({...editMemberForm, countsInCapacity: e.target.checked})}
                          style={{width:'16px',height:'16px',accentColor:'var(--cyan)'}}/>
                      </td>
                      <td><span className="badge green">Actif</span></td>
                      <td>
                        <div style={{display:'flex',gap:'6px'}}>
                          <button onClick={() => saveMember(m.id)}
                            style={{background:'var(--green-dim)',border:'1px solid var(--green-border)',borderRadius:'4px',padding:'3px 8px',fontFamily:'DM Mono',fontSize:'9px',color:'var(--green)',cursor:'pointer'}}>
                            ✓
                          </button>
                          <button onClick={() => setEditingMember(null)}
                            style={{background:'var(--red-dim)',border:'1px solid var(--red-border)',borderRadius:'4px',padding:'3px 8px',fontFamily:'DM Mono',fontSize:'9px',color:'var(--red)',cursor:'pointer'}}>
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={m.id} style={{opacity: m.status === 'inactive' ? 0.4 : 1}}>
                      <td style={{color:'var(--text)',fontWeight:500}}>{m.firstName} {m.lastName}</td>
                      <td><span className="badge" style={{color:'var(--cyan)',background:'var(--cyan-dim)',borderColor:'var(--cyan-border)',borderRadius:'4px'}}>{m.role}</span></td>
                      <td className="num">{m.fte}</td>
                      <td>
                        {m.countsInCapacity
                          ? <span style={{color:'var(--green)',fontFamily:'DM Mono',fontSize:'10px'}}>✓ Capa</span>
                          : <span style={{color:'var(--muted)',fontFamily:'DM Mono',fontSize:'10px'}}>— Hors capa</span>}
                      </td>
                      <td>
                        {m.status === 'active'
                          ? <span className="badge green">Actif</span>
                          : <span className="badge muted">Inactif</span>}
                      </td>
                      <td>
                        <div style={{display:'flex',gap:'6px'}}>
                          {m.status === 'active' && (
                            <>
                              <button onClick={() => {
                                setEditingMember(m.id)
                                setEditMemberForm({firstName: m.firstName, lastName: m.lastName, role: m.role, fte: m.fte, countsInCapacity: m.countsInCapacity})
                              }} style={{background:'var(--cyan-dim)',border:'1px solid var(--cyan-border)',borderRadius:'4px',padding:'3px 8px',fontFamily:'DM Mono',fontSize:'9px',color:'var(--cyan)',cursor:'pointer'}}>
                                ✏️
                              </button>
                              <button onClick={() => deactivateMember(m.id, `${m.firstName} ${m.lastName}`)}
                                style={{background:'var(--red-dim)',border:'1px solid var(--red-border)',borderRadius:'4px',padding:'3px 8px',fontFamily:'DM Mono',fontSize:'9px',color:'var(--red)',cursor:'pointer'}}>
                                ✕
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid-2">
          <div className="card card-accent-cyan">
            <div className="card-head">
              <span className="label">Capacité équipe</span>
              <span className="badge cyan">{totalFte} FTE</span>
            </div>
            <div className="card-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                  <div className="label" style={{marginBottom:'4px'}}>Devs en capa</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--cyan)'}}>{capaDevs.length}</div>
                </div>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                  <div className="label" style={{marginBottom:'4px'}}>Total FTE</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--green)'}}>{totalFte}</div>
                </div>
              </div>
              <div className="label" style={{marginBottom:'8px'}}>Répartition capacité</div>
              <div style={{display:'flex',height:'28px',borderRadius:'6px',overflow:'hidden',gap:'2px'}}>
                <div style={{width:`${Math.round(team.pctBau*100)}%`,background:'var(--yellow)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono',fontSize:'9px',color:'var(--bg)',fontWeight:700}}>BAU {Math.round(team.pctBau*100)}%</div>
                <div style={{width:`${Math.round(team.pctRisk*100)}%`,background:'var(--red)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono',fontSize:'9px',color:'var(--bg)',fontWeight:700}}>R {Math.round(team.pctRisk*100)}%</div>
                <div style={{flex:1,background:'var(--green)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono',fontSize:'9px',color:'var(--bg)',fontWeight:700}}>Produit {pctProduit}%</div>
              </div>
            </div>
          </div>

          <div className="card card-accent-purple">
            <div className="card-head">
              <span className="label">Configuration</span>
              <span className="badge purple">{team.predMode.toUpperCase()}</span>
            </div>
            <div className="card-body">
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                  <div className="label" style={{marginBottom:'4px'}}>Durée sprint</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--cyan)'}}>{team.sprintDurationWeeks} sem.</div>
                </div>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                  <div className="label" style={{marginBottom:'4px'}}>% BAU</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--yellow)'}}>{Math.round(team.pctBau*100)}%</div>
                </div>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                  <div className="label" style={{marginBottom:'4px'}}>% Risque</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--red)'}}>{Math.round(team.pctRisk*100)}%</div>
                </div>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                  <div className="label" style={{marginBottom:'4px'}}>Mode Préd.</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'20px',color:'var(--purple)'}}>{team.predMode}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}