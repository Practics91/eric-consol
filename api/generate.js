export default async function handler(req, res) {
  const { goal, systemLayer } = req.body

  const prompt = `Analyseer deze situatie vanuit systeemlogica.\n
Doel: ${goal || '[doel]'}\n
Systeemlaag: ${systemLayer || '[systeemlaag]'}\n\n
Geef een scherpe, functionele prompt terug in ritmisch heldere taal. Vermijd sociaal plamuur en modetaal. Richt op gedrag, rol, structuur of richting. Voeg optioneel een tweede versie toe in neutralere toon.`

  try {
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
    console.log('OpenAI response (GPT-4):', result)

    if (result.choices?.[0]?.message?.content) {
      return res.status(200).json({ result: result.choices[0].message.content })
    } else if (result.error) {
      console.warn('GPT-4 failed, trying gpt-3.5-turbo…', result.error)

      // Fallback naar GPT-3.5
      const fallback = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.6,
        }),
      })

      const fallbackResult = await fallback.json()
      console.log('Fallback (GPT-3.5) response:', fallbackResult)

      return res.status(200).json({
        result:
          fallbackResult.choices?.[0]?.message?.content || 'Geen output ontvangen van GPT-3.5.',
      })
    } else {
      throw new Error('Geen geldige response van OpenAI.')
    }
  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ result: 'Fout bij ophalen van prompt.' })
  }
}
