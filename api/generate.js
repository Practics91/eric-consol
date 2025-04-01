module.exports = async function handler(req, res) {
  const { goal, systemLayer } = req.body

  const prompt = `Analyseer deze situatie vanuit systeemlogica.\n
Doel: ${goal || '[doel]'}\n
Systeemlaag: ${systemLayer || '[systeemlaag]'}\n\n
Geef een scherpe, functionele prompt terug in ritmisch heldere taal. Vermijd sociaal plamuur en modetaal. Richt op gedrag, rol, structuur of richting. Voeg optioneel een tweede versie toe in neutralere toon.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

  const result = await response.json()
  const content = result.choices?.[0]?.message?.content || 'Geen output ontvangen.'
  res.status(200).json({ result: content })
}
