"use client"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          PULSE<span> / delivery</span>
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link">Dashboard</a>
          <a href="/equipes" className="nav-link">Équipes</a>
          <a href="/cycles" className="nav-link">Cycles</a>
          <a href="/sprints" className="nav-link">Sprints</a>
          <a href="/predictibilite" className="nav-link">Prédictibilité</a>
          <a href="/settings" className="nav-link">Settings</a>
        </div>
        <button
          onClick={() => {
            fetch('/api/auth/signout', {method:'POST'}).then(() => window.location.href = '/login')
          }}
          style={{fontFamily:'DM Mono',fontSize:'9px',letterSpacing:'1px',textTransform:'uppercase',color:'var(--muted)',background:'transparent',border:'1px solid var(--border)',borderRadius:'5px',padding:'5px 10px',cursor:'pointer'}}>
          Déconnexion
        </button>
      </nav>
      {children}
    </>
  )
}