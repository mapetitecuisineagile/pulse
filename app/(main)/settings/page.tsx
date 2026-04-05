"use client"
import { useState, useEffect } from 'react'

interface Team {
  id: string
  name: string
  slug: string
  sprintDurationWeeks: number
  pctBau: number
  pctRisk: number
  pctCerem: number
  pctOther: number
  predMode: string
}

export default function Settings() {
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedSlug, setSelectedSlug] = useState<string>('')
  const [pctBau, setPctBau] = useState(30)
  const [pctRisque, setPctRisque] = useState(10)
  const [pctCerem, setPctCerem] = useState(0)
  const [pctAutre, setPctAutre] = useState(0)
  const [sprintDuration, setSprintDuration] = useState(3)
  const [predMode, setPredMode] = useState('sp')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const pctProduit = 100 - pctBau - pctRisque - pctCerem - pctAutre

  useEffect(() => {
    fetch('/api/teams', { credentials: 'include' })
      .then(r => r.json())
      .then((data: Team[]) => {
        setTeams(data)
        if (data.length > 0) {
          const t = data[0]
          setSelectedSlug(t.slug)
          setPctBau(Math.round(t.pctBau * 100))
          setPctRisque(Math.round(t.pctRisk * 100))
          setPctCerem(Math.round(t.pctCerem * 100))
          setPctAutre(Math.round(t.pctOther * 100))
          setSprintDuration(t.sprintDurationWeeks)
          setPredMode(t.predMode)
        }
        setLoading(false)
      })
  }, [])

  function onTeamChange(slug: string) {
    const t = teams.find(t => t.slug === slug)
    if (!t) return
    setSelectedSlug(slug)
    setPctBau(Math.round(t.pctBau * 100))
    setPctRisque(Math.round(t.pctRisk * 100))
    setPctCerem(Math.round(t.pctCerem * 100))
    setPctAutre(Math.round(t.pctOther * 100))
    setSprintDuration(t.sprintDurationWeeks)
    setPredMode(t.predMode)
  }

  async function save() {
    const res = await fetch(`/api/teams/${selectedSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sprintDurationWeeks: sprintDuration,
        pctBau: pctBau / 100,
        pctRisk: pctRisque / 100,
        pctCerem: pctCerem / 100,
        pctOther: pctAutre / 100,
        predMode,
      }),
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) return (
    <main><div style={{padding:'60px',textAlign:'center',fontFamily:'DM Mono',fontSize:'10px',color:'var(--muted)',letterSpacing:'2px'}}>CHARGEMENT...</div></main>
  )

  return (
    <main>
      <div className="page-header">
        <div className="label">Configuration</div>
        <h1>Settings <span>équipe</span></h1>
      </div>
      <div className="page-content">

        {/* Sélecteur équipe */}
        <div className="card" style={{marginBottom:'16px'}}>
          <div className="card-head">
            <span className="label">Équipe à configurer</span>
          </div>
          <div className="card-body">
            <label className="input-label">Sélectionner une équipe</label>
            <select className="input" style={{maxWidth:'400px'}}
              value={selectedSlug}
              onChange={e => onTeamChange(e.target.value)}>
              {teams.map(t => (
                <option key={t.slug} value={t.slug}>{t.name} ({t.slug})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid-2">

          {/* Durée sprint */}
          <div className="card card-accent-cyan">
            <div className="card-head">
              <span className="label">Durée de sprint</span>
              <span className="badge cyan">Par défaut équipe</span>
            </div>
            <div className="card-body">
              <div style={{marginBottom:'20px'}}>
                <label className="input-label">Durée par défaut</label>
                <select className="input"
                  value={sprintDuration}
                  onChange={e => setSprintDuration(parseInt(e.target.value))}>
                  <option value={1}>1 semaine</option>
                  <option value={2}>2 semaines</option>
                  <option value={3}>3 semaines</option>
                  <option value={4}>4 semaines</option>
                </select>
              </div>
              <div style={{padding:'12px 16px',background:'var(--yellow-dim)',border:'1px solid var(--yellow-border)',borderRadius:'8px',fontFamily:'DM Mono',fontSize:'10px',color:'var(--yellow)',lineHeight:'1.7'}}>
                ⚠️ Les projections sont fiables uniquement si les sprints ont une durée stable sur tout un cycle.
              </div>
            </div>
          </div>

          {/* Mode prédictibilité */}
          <div className="card card-accent-purple">
            <div className="card-head">
              <span className="label">Mode prédictibilité</span>
              <span className="badge purple">Calcul</span>
            </div>
            <div className="card-body">
              <div style={{marginBottom:'16px'}}>
                <label className="input-label">Mode de calcul</label>
                <select className="input"
                  value={predMode}
                  onChange={e => setPredMode(e.target.value)}>
                  <option value="sp">Story Points (SP)</option>
                  <option value="throughput">Débit (US done / US engagées)</option>
                  <option value="both">Mixte — les deux</option>
                </select>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                  <div className="label" style={{marginBottom:'4px'}}>Mode SP</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'11px',color:'var(--subtle)'}}>Done ÷ (Target + Add)</div>
                </div>
                <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                  <div className="label" style={{marginBottom:'4px'}}>Mode Débit</div>
                  <div style={{fontFamily:'Space Mono',fontSize:'11px',color:'var(--subtle)'}}>US done ÷ US engagées</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Réserves */}
        <div className="card card-accent-yellow" style={{marginTop:'16px'}}>
          <div className="card-head">
            <span className="label">Réserves & Marges de capacité</span>
            <span className="badge yellow">Capa dispo : {pctProduit}%</span>
          </div>
          <div className="card-body">
            <div className="grid-2" style={{marginBottom:'24px'}}>
              <div>
                <label className="input-label">% BAU / MCO — Soutien opérationnel</label>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <input type="range" min="0" max="60" value={pctBau} step="5"
                    onChange={e=>setPctBau(Number(e.target.value))}
                    style={{flex:1,accentColor:'var(--yellow)'}}/>
                  <span style={{fontFamily:'Space Mono',fontSize:'16px',color:'var(--yellow)',minWidth:'40px'}}>{pctBau}%</span>
                </div>
              </div>
              <div>
                <label className="input-label">% Risque — Buffer imprévus</label>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <input type="range" min="0" max="30" value={pctRisque} step="5"
                    onChange={e=>setPctRisque(Number(e.target.value))}
                    style={{flex:1,accentColor:'var(--red)'}}/>
                  <span style={{fontFamily:'Space Mono',fontSize:'16px',color:'var(--red)',minWidth:'40px'}}>{pctRisque}%</span>
                </div>
              </div>
              <div>
                <label className="input-label">% Cérémonies — Réunions, rétros</label>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <input type="range" min="0" max="20" value={pctCerem} step="5"
                    onChange={e=>setPctCerem(Number(e.target.value))}
                    style={{flex:1,accentColor:'var(--purple)'}}/>
                  <span style={{fontFamily:'Space Mono',fontSize:'16px',color:'var(--purple)',minWidth:'40px'}}>{pctCerem}%</span>
                </div>
              </div>
              <div>
                <label className="input-label">% Autre — Formation, accompagnement</label>
                <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
                  <input type="range" min="0" max="20" value={pctAutre} step="5"
                    onChange={e=>setPctAutre(Number(e.target.value))}
                    style={{flex:1,accentColor:'var(--cyan)'}}/>
                  <span style={{fontFamily:'Space Mono',fontSize:'16px',color:'var(--cyan)',minWidth:'40px'}}>{pctAutre}%</span>
                </div>
              </div>
            </div>

            {/* Jauge */}
            <div className="label" style={{marginBottom:'8px'}}>Répartition de la capacité</div>
            <div style={{display:'flex',height:'32px',borderRadius:'6px',overflow:'hidden',gap:'2px'}}>
              {pctBau > 0 && <div style={{width:`${pctBau}%`,background:'var(--yellow)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono',fontSize:'9px',color:'var(--bg)',fontWeight:700,transition:'width .2s'}}>
                {pctBau > 5 ? `BAU ${pctBau}%` : ''}
              </div>}
              {pctRisque > 0 && <div style={{width:`${pctRisque}%`,background:'var(--red)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono',fontSize:'9px',color:'var(--bg)',fontWeight:700,transition:'width .2s'}}>
                {pctRisque > 5 ? `R ${pctRisque}%` : ''}
              </div>}
              {pctCerem > 0 && <div style={{width:`${pctCerem}%`,background:'var(--purple)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono',fontSize:'9px',color:'var(--bg)',fontWeight:700,transition:'width .2s'}}>
                {pctCerem > 5 ? `Cér ${pctCerem}%` : ''}
              </div>}
              {pctAutre > 0 && <div style={{width:`${pctAutre}%`,background:'var(--cyan)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono',fontSize:'9px',color:'var(--bg)',fontWeight:700,transition:'width .2s'}}>
                {pctAutre > 5 ? `Autre ${pctAutre}%` : ''}
              </div>}
              <div style={{flex:1,background:'var(--green)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'DM Mono',fontSize:'9px',color:'var(--bg)',fontWeight:700,transition:'all .2s'}}>
                Produit {pctProduit}%
              </div>
            </div>

            <div style={{marginTop:'20px',display:'flex',alignItems:'center',gap:'12px',justifyContent:'flex-end'}}>
              {saved && (
                <span style={{fontFamily:'DM Mono',fontSize:'10px',color:'var(--green)',letterSpacing:'1px'}}>
                  ✓ Sauvegardé !
                </span>
              )}
              <button className="btn btn-primary" onClick={save}>
                Sauvegarder →
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}