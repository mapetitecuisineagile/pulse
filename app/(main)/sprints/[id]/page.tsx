"use client"
import { useState, useEffect, use } from 'react'

interface BurndownEntry {
  id: string
  dayNumber: number
  date: string
  remainingSp: number | null
  doneSp: number | null
  scopeTotal: number | null
}

interface SprintItem {
  id: string
  jiraKey: string | null
  title: string
  type: string
  scope: string
  storyPoints: number | null
  status: string
}

interface Sprint {
  id: string
  label: string
  quarter: string
  startDate: string
  endDate: string
  status: string
  sprintGoal: string | null
  items: SprintItem[]
  burndown: BurndownEntry[]
}

const typeColor: Record<string, string> = {
  US:'var(--cyan)', UST:'var(--purple)', BUG:'var(--red)', ACTION:'var(--green)', ETUDE:'var(--yellow)'
}
const scopeLabel: Record<string, string> = {
  committed:'Engagé', bau:'BAU', best_effort:'Best Effort', respiration:'Respiration'
}
const statusColor: Record<string, string> = {
  done:'var(--green)', in_progress:'var(--cyan)', todo:'var(--muted)'
}
const statusLabel: Record<string, string> = {
  done:'Done', in_progress:'En cours', todo:'À faire'
}

export default function SprintDetail({ params }: { params: any }) {
  const { id } = use(params) as { id: string }
  const [sprint, setSprint] = useState<Sprint | null>(null)
  const [loading, setLoading] = useState(true)
  const [saisie, setSaisie] = useState('')
  const [showItemForm, setShowItemForm] = useState(false)
  const [itemForm, setItemForm] = useState({
    title: '', jiraKey: '', type: 'US', scope: 'committed', storyPoints: ''
  })

  useEffect(() => {
    fetch(`/api/sprints/${id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setSprint(data); setLoading(false) })
  }, [id])

  async function saisirSP() {
    if (!sprint || !saisie) return
    const val = parseInt(saisie)
    if (isNaN(val)) return

    const jourCourant = sprint.burndown.length
    const today = new Date().toISOString().split('T')[0]

    // Scope total = somme des SP des items, ou repris du jour précédent
    const scopeTotal = sprint.items.reduce((acc, item) => acc + (item.storyPoints || 0), 0) ||
      (sprint.burndown.length > 0 ? sprint.burndown[sprint.burndown.length-1].scopeTotal : val)

    const res = await fetch(`/api/sprints/${id}/burndown`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dayNumber: jourCourant,
        date: today,
        remainingSp: val,
        doneSp: scopeTotal ? scopeTotal - val : null,
        scopeTotal,
      }),
    })
    if (res.ok) {
      const entry = await res.json()
      setSprint({ ...sprint, burndown: [...sprint.burndown, entry] })
      setSaisie('')
    }
  }

  async function addItem() {
    if (!sprint) return
    const res = await fetch(`/api/sprints/${id}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...itemForm,
        storyPoints: itemForm.storyPoints ? parseInt(itemForm.storyPoints) : null,
      }),
    })
    if (res.ok) {
      const item = await res.json()
      setSprint({ ...sprint, items: [...sprint.items, item] })
      setShowItemForm(false)
      setItemForm({ title: '', jiraKey: '', type: 'US', scope: 'committed', storyPoints: '' })
    }
  }

  if (loading) return (
    <main><div style={{padding:'60px',textAlign:'center',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>CHARGEMENT...</div></main>
  )

  if (!sprint) return (
    <main><div style={{padding:'60px',textAlign:'center',fontFamily:'DM Mono',fontSize:'10px',color:'var(--red)',letterSpacing:'2px'}}>SPRINT INTROUVABLE</div></main>
  )

  const scopeTotalItems = sprint.items.reduce((acc, item) => acc + (item.storyPoints || 0), 0)
  const maxSP = sprint.burndown.length > 0
    ? sprint.burndown[0].scopeTotal || scopeTotalItems || 88
    : scopeTotalItems || 88
  const spDone = sprint.burndown.length > 0
    ? maxSP - (sprint.burndown[sprint.burndown.length-1].remainingSp || 0)
    : 0
  const pctAvancement = maxSP > 0 ? Math.round(spDone / maxSP * 100) : 0
  const jourCourant = sprint.burndown.length

  const w = 520, h = 140, padL = 30, padR = 10, padT = 10, padB = 25
  const chartW = w - padL - padR
  const chartH = h - padT - padB
  const nbJours = 14

  function xPos(i: number){ return padL + (i/nbJours)*chartW }
  function yPos(val: number){ return padT + (1 - val/maxSP)*chartH }

  const pointsReel = sprint.burndown
    .map((j, i) => `${xPos(i)},${yPos(j.remainingSp || 0)}`)
    .join(' ')

  const idealPoints = Array.from({length: nbJours + 1}, (_, i) =>
    `${xPos(i)},${yPos(maxSP * (1 - i/nbJours))}`
  ).join(' ')

  return (
    <main>
      <div className="page-header">
        <div className="label">{sprint.quarter} — {sprint.label}</div>
        <h1>Burndown <span>interactif</span></h1>
      </div>
      <div className="page-content">

        <div className="grid-4" style={{marginBottom:'20px'}}>
          <div className="kpi cyan">
            <div className="kpi-label">SP Restants</div>
            <div className="kpi-value">{sprint.burndown.length > 0 ? sprint.burndown[sprint.burndown.length-1].remainingSp ?? '—' : '—'}</div>
            <div className="kpi-sub">sur {maxSP} SP engagés</div>
          </div>
          <div className="kpi green">
            <div className="kpi-label">SP Done</div>
            <div className="kpi-value">{spDone}</div>
            <div className="kpi-sub">cumulés</div>
          </div>
          <div className="kpi yellow">
            <div className="kpi-label">Avancement</div>
            <div className="kpi-value">{pctAvancement}%</div>
            <div className="kpi-sub">J{jourCourant} / 15</div>
          </div>
          <div className="kpi purple">
            <div className="kpi-label">Items</div>
            <div className="kpi-value">{sprint.items.length}</div>
            <div className="kpi-sub">{sprint.items.filter(i=>i.status==='done').length} done</div>
          </div>
        </div>

        <div className="card card-accent-cyan" style={{marginBottom:'16px'}}>
          <div className="card-head">
            <span className="label">Burndown — {sprint.label}</span>
            <div style={{display:'flex',gap:'16px',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',fontFamily:'DM Mono',fontSize:'9px',color:'var(--muted)'}}>
                <div style={{width:'20px',height:'1px',borderTop:'1px dashed var(--subtle)'}}></div>Idéal
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'6px',fontFamily:'DM Mono',fontSize:'9px',color:'var(--cyan)'}}>
                <div style={{width:'20px',height:'2px',background:'var(--cyan)'}}></div>Réel
              </div>
            </div>
          </div>
          <div className="card-body">

            {scopeTotalItems === 0 && sprint.burndown.length === 0 && (
              <div style={{padding:'16px',background:'var(--yellow-dim)',border:'1px solid var(--yellow-border)',borderRadius:'8px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--yellow)',marginBottom:'12px'}}>
                ⚠️ Ajoutez des items avec des SP pour initialiser le scope du burndown
              </div>
            )}

            <svg viewBox={`0 0 ${w} ${h}`} style={{width:'100%',height:'160px'}}>
              {[0,Math.round(maxSP*0.25),Math.round(maxSP*0.5),Math.round(maxSP*0.75),maxSP].map(v=>(
                <g key={v}>
                  <line x1={padL} y1={yPos(v)} x2={w-padR} y2={yPos(v)} stroke="#1a2540" strokeWidth="1"/>
                  <text x={padL-4} y={yPos(v)+4} fontFamily="DM Mono" fontSize="7" fill="#4a6080" textAnchor="end">{v}</text>
                </g>
              ))}
              <polyline points={idealPoints} fill="none" stroke="#2a3550" strokeWidth="1.5" strokeDasharray="4,3"/>
              {sprint.burndown.length > 1 && (
                <>
                  <polygon points={`${pointsReel} ${xPos(jourCourant-1)},${padT+chartH} ${padL},${padT+chartH}`}
                    fill="rgba(0,212,255,0.06)"/>
                  <polyline points={pointsReel} fill="none" stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </>
              )}
              {jourCourant > 0 && sprint.burndown[jourCourant-1] && (
                <circle cx={xPos(jourCourant-1)} cy={yPos(sprint.burndown[jourCourant-1].remainingSp || 0)} r="4" fill="var(--cyan)" stroke="var(--bg)" strokeWidth="2"/>
              )}
            </svg>

            <div style={{display:'flex',alignItems:'center',gap:'12px',marginTop:'16px',padding:'14px',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px'}}>
              <div className="label" style={{whiteSpace:'nowrap'}}>Saisir J{jourCourant} — SP restants</div>
              <input type="number" placeholder="SP restants..."
                value={saisie}
                onChange={e=>setSaisie(e.target.value)}
                className="input" style={{maxWidth:'160px'}}/>
              <button className="btn btn-primary" onClick={saisirSP}>Valider</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <span className="label">Items du sprint</span>
            <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
              <span className="badge green">{sprint.items.filter(i=>i.status==='done').length} Done</span>
              <span className="badge cyan">{sprint.items.filter(i=>i.status==='in_progress').length} En cours</span>
              <span className="badge yellow">Total : {scopeTotalItems} SP</span>
              <button className="btn btn-primary" style={{padding:'4px 12px',fontSize:'9px'}} onClick={()=>setShowItemForm(!showItemForm)}>
                {showItemForm ? '✕' : '+ Item'}
              </button>
            </div>
          </div>

          {showItemForm && (
            <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',background:'var(--surface-2)'}}>
              <div className="grid-2" style={{gap:'12px',marginBottom:'12px'}}>
                <div>
                  <label className="input-label">Titre</label>
                  <input className="input" placeholder="Titre de l'item"
                    value={itemForm.title}
                    onChange={e=>setItemForm({...itemForm, title: e.target.value})}/>
                </div>
                <div>
                  <label className="input-label">Clé Jira (optionnel)</label>
                  <input className="input" placeholder="ex: MOT-121"
                    value={itemForm.jiraKey}
                    onChange={e=>setItemForm({...itemForm, jiraKey: e.target.value})}/>
                </div>
                <div>
                  <label className="input-label">Type</label>
                  <select className="input" value={itemForm.type}
                    onChange={e=>setItemForm({...itemForm, type: e.target.value})}>
                    <option value="US">User Story</option>
                    <option value="UST">US Technique</option>
                    <option value="BUG">Bug</option>
                    <option value="ACTION">Action/Kaizen</option>
                    <option value="ETUDE">Étude/Spike</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Scope</label>
                  <select className="input" value={itemForm.scope}
                    onChange={e=>setItemForm({...itemForm, scope: e.target.value})}>
                    <option value="committed">Engagé</option>
                    <option value="bau">BAU</option>
                    <option value="best_effort">Best Effort</option>
                    <option value="respiration">Respiration</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Story Points</label>
                  <input className="input" type="number" placeholder="SP"
                    value={itemForm.storyPoints}
                    onChange={e=>setItemForm({...itemForm, storyPoints: e.target.value})}/>
                </div>
              </div>
              <button className="btn btn-primary" onClick={addItem}
                disabled={!itemForm.title}>
                Ajouter l'item →
              </button>
            </div>
          )}

          <div style={{padding:'0'}}>
            <table className="data-table">
              <thead>
                <tr>
              <th>Clé</th><th>Titre</th><th>Type</th><th>Scope</th><th>SP</th><th>Statut</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sprint.items.length === 0 && (
                  <tr><td colSpan={6} style={{textAlign:'center',padding:'24px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)'}}>
                    Aucun item — ajoutez le premier item
                  </td></tr>
                )}
                {sprint.items.map(item => (
                  <tr key={item.id}>
                    <td><span style={{fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)'}}>{item.jiraKey || '—'}</span></td>
                    <td style={{color:'var(--text)',maxWidth:'280px'}}>{item.title}</td>
                    <td><span className="badge" style={{color:typeColor[item.type],background:`${typeColor[item.type]}15`,borderColor:`${typeColor[item.type]}40`,borderRadius:'4px'}}>{item.type}</span></td>
                    <td><span style={{fontFamily:'DM Mono',fontSize:'9px',color:'var(--muted)'}}>{scopeLabel[item.scope] || item.scope}</span></td>
                    <td className="num">{item.storyPoints || '—'}</td>
                    <td>
  <select
    value={item.status}
    onChange={async e => {
      const res = await fetch(`/api/items/${item.id}`, {
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({status: e.target.value}),
      })
      if (res.ok) {
        setSprint({...sprint!, items: sprint!.items.map(i =>
          i.id === item.id ? {...i, status: e.target.value} : i
        )})
      }
    }}
    style={{
      background:'var(--surface)',
      border:'1px solid var(--border)',
      borderRadius:'4px',
      padding:'3px 8px',
      fontFamily:'DM Mono',
      fontSize:'9px',
      color:statusColor[item.status],
      cursor:'pointer',
    }}>
    <option value="todo">À faire</option>
    <option value="in_progress">En cours</option>
    <option value="done">Done</option>
  </select>
</td>
<td>
  <button
    onClick={async () => {
      if (!confirm('Supprimer cet item ?')) return
      const res = await fetch(`/api/items/${item.id}`, { method: 'DELETE' })
      if (res.ok) {
        setSprint({...sprint!, items: sprint!.items.filter(i => i.id !== item.id)})
      }
    }}
    style={{
      background:'var(--red-dim)',
      border:'1px solid var(--red-border)',
      borderRadius:'4px',
      padding:'3px 8px',
      fontFamily:'DM Mono',
      fontSize:'9px',
      color:'var(--red)',
      cursor:'pointer',
    }}>
    ✕
  </button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  )
}