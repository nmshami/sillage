export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { query, country = 'Saudi Arabia' } = req.body;
  if (!query) return res.status(400).json({ error: 'Missing query' });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const storesByCountry = {
    'Saudi Arabia': ['Gold Apple SA','Golden Scent','Amazon.sa','Nahdi Online','Arabian Oud'],
    'United Arab Emirates': ['Gold Apple UAE','Golden Scent','Amazon.ae','Faces','Noon UAE'],
    'United Kingdom': ['Harrods','Selfridges','John Lewis','Liberty London','Fragrance Direct'],
    'United States': ['Scentbeauty','Bergdorf Goodman','Neiman Marcus','FragranceNet','Bloomingdales'],
    'France': ['Sephora France','Marionnaud','Galeries Lafayette','Le Bon Marche','Nocibe'],
    'Germany': ['Douglas','Amazon.de','Flaconi','Parfumdreams','Sephora Germany'],
  };
  const currencyByCountry = { 'Saudi Arabia':'SAR','United Arab Emirates':'AED','United Kingdom':'GBP','United States':'USD','France':'EUR','Germany':'EUR' };
  const stores = storesByCountry[country] || storesByCountry['Saudi Arabia'];
  const currency = currencyByCountry[country] || 'SAR';

  const prompt = `You are a global fragrance market expert. Provide current price data for: "${query}" in ${country}.
Return ONLY a raw JSON object. No markdown, no code fences.
{"fragrance":"Full name","notes":"notes summary","category":"Niche/Designer/Arabian","verdict":"2-3 sentence recommendation for ${country}","platforms":[${stores.map(s=>`{"name":"${s}","price":null,"available":false,"size":"100ml","shipping":"Standard","auth":"High","note":"brief"}`).join(',')}]}
Use realistic ${currency} prices. Set available:false and price:null if not stocked. auth: High/Medium/Low.`;

  try {
    const up = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1200,messages:[{role:'user',content:prompt}]})
    });
    const data = await up.json();
    if(!data.content?.[0]?.text) throw new Error('Empty response');
    const text = data.content[0].text.trim().replace(/```json|```/g,'').trim();
    return res.status(200).json(JSON.parse(text));
  } catch(e) { return res.status(500).json({error:e.message||'Failed'}); }
}
