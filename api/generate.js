export default async function handler(req, res) {
  try {
    const { goal, systemLayer } = req.body

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ result: 'Geen API key ingesteld.' })
    }

    const prompt = `Analyseer deze situatie vanuit systeemlogica.\n
Doel: ${goal || '[doel]'}\n
Systeemlaag: ${systemLayer || '[systeemlaag]'}\n\n
Geef een scherpe, functionele prompt terug in ritmisch heldere taal. Vermijd sociaal plamuur en modetaal. Richt op gedrag, rol, structuur of richting. Voeg optioneel een tweede versie toe in neutralere toon.`

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
      }),
    })

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text()
      console.error('OpenAI API fout:', errorText)
      return res.status(500).json({ result: 'OpenAI fout: ' + errorText })
    }

    const result = await openaiRes.json()
    const content = result.choices?.[0]?.message?.content

    if (!content) {
      console.error('Lege output van OpenAI:', result)
      return res.status(500).json({ result: 'OpenAI gaf geen geldige output.' })
    }

    res.status(200).json({ result: content })

  } catch (error) {
    console.error('Serverfout:', error)
    res.status(500).json({ result: 'Interne serverfout bij ophalen prompt.' })
  }
}
