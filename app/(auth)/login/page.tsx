"use client"
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    if (res?.ok) {
      router.push('/')
    } else {
      setError('Identifiant ou mot de passe incorrect')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:'100vh',
      background:'#080c14',
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
      fontFamily:'Space Grotesk, sans-serif',
    }}>
      <div style={{
        background:'#0e1420',
        border:'1px solid #1a2540',
        borderRadius:'16px',
        padding:'48px 40px',
        width:'100%',
        maxWidth:'420px',
      }}>

        {/* Logo */}
        <div style={{textAlign:'center',marginBottom:'40px'}}>
          <div style={{
            fontFamily:'DM Mono, monospace',
            fontSize:'28px',
            letterSpacing:'6px',
            color:'#00d4ff',
            marginBottom:'8px',
          }}>PULSE</div>
          <div style={{
            fontFamily:'DM Mono, monospace',
            fontSize:'9px',
            letterSpacing:'3px',
            textTransform:'uppercase',
            color:'#4a6080',
          }}>Delivery Tracker</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'20px'}}>
            <label style={{
              display:'block',
              fontFamily:'DM Mono, monospace',
              fontSize:'9px',
              letterSpacing:'2px',
              textTransform:'uppercase',
              color:'#4a6080',
              marginBottom:'8px',
            }}>Identifiant</label>
            <input
              type="text"
              value={username}
              onChange={e=>setUsername(e.target.value)}
              style={{
                width:'100%',
                background:'#121824',
                border:'1px solid #1a2540',
                borderRadius:'8px',
                padding:'12px 16px',
                color:'#e8eaf0',
                fontFamily:'Space Grotesk, sans-serif',
                fontSize:'14px',
                outline:'none',
              }}
              onFocus={e=>e.target.style.borderColor='rgba(0,212,255,0.4)'}
              onBlur={e=>e.target.style.borderColor='#1a2540'}
            />
          </div>

          <div style={{marginBottom:'28px'}}>
            <label style={{
              display:'block',
              fontFamily:'DM Mono, monospace',
              fontSize:'9px',
              letterSpacing:'2px',
              textTransform:'uppercase',
              color:'#4a6080',
              marginBottom:'8px',
            }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              style={{
                width:'100%',
                background:'#121824',
                border:'1px solid #1a2540',
                borderRadius:'8px',
                padding:'12px 16px',
                color:'#e8eaf0',
                fontFamily:'Space Grotesk, sans-serif',
                fontSize:'14px',
                outline:'none',
              }}
              onFocus={e=>e.target.style.borderColor='rgba(0,212,255,0.4)'}
              onBlur={e=>e.target.style.borderColor='#1a2540'}
            />
          </div>

          {error && (
            <div style={{
              marginBottom:'20px',
              padding:'10px 14px',
              background:'rgba(255,107,107,0.1)',
              border:'1px solid rgba(255,107,107,0.3)',
              borderRadius:'8px',
              fontFamily:'DM Mono, monospace',
              fontSize:'10px',
              color:'#ff6b6b',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width:'100%',
              padding:'14px',
              background: loading ? 'rgba(0,255,157,0.1)' : 'rgba(0,255,157,0.15)',
              border:'1px solid rgba(0,255,157,0.3)',
              borderRadius:'8px',
              color:'#00ff9d',
              fontFamily:'DM Mono, monospace',
              fontSize:'11px',
              letterSpacing:'3px',
              textTransform:'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition:'all 0.2s',
            }}
          >
            {loading ? 'Connexion...' : 'Entrer'}
          </button>
        </form>

        <div style={{
          marginTop:'32px',
          textAlign:'center',
          fontFamily:'DM Mono, monospace',
          fontSize:'9px',
          letterSpacing:'2px',
          textTransform:'uppercase',
          color:'#1a2540',
        }}>
          mapetitecuisineagile.com · 2026
        </div>

      </div>
    </div>
  )
}