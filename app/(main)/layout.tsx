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
        <div className="team-pill">
          <div className="pulse-dot"></div>
          E.T 👽
        </div>
      </nav>
      {children}
    </>
  )
}