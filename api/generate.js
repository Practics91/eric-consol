const generatePrompt = async () => {
  setLoading(true)
  setOutput('') // clear previous output

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, systemLayer }),
    })

    const data = await res.json()
    console.log('RESPONSE DATA:', data)

    if (data?.result) {
      setOutput(data.result)
    } else {
      setOutput('Geen geldige output ontvangen van de API.')
    }

  } catch (error) {
    console.error('API Error:', error)
    setOutput('Fout bij ophalen prompt. Controleer de server.')
  }

  setLoading(false)
}
