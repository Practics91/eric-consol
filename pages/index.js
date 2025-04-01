import { useState } from 'react'

export default function Home() {
  const [goal, setGoal] = useState('')
  const [systemLayer, setSystemLayer] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const generatePrompt = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, systemLayer }),
      })

      const data = await res.json()
      setOutput(data.output || 'Geen output ontvangen.')
    } catch (error) {
      setOutput('Fout bij ophalen van prompt.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: '4rem auto', fontFamily: 'sans-serif' }}>
      <h1>Promptconsole – Systeemstijl</h1>
      <input
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        placeholder="Wat is het doel van deze prompt?"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <input
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
        placeholder="Welke systeemlaag wil je raken?"
        value={systemLayer}
        onChange={(e) => setSystemLayer(e.target.value)}
      />
      <button onClick={generatePrompt} disabled={loading}>
        {loading ? 'Even wachten...' : 'Genereer Prompt'}
      </button>
      <pre style={{ background: '#111', color: '#0f0', padding: '1rem', marginTop: '2rem', whiteSpace: 'pre-wrap' }}>
        {output}
      </pre>
    </main>
  )
}
