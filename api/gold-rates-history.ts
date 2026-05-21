import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { days = 7 } = req.query;
      const limit = Math.min(parseInt(days), 30);

      const { data, error } = await supabase
        .from('gold_rate_history')
        .select('*')
        .order('date', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return res.status(200).json(data || []);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Gold rates history API error:', err);
    res.status(500).json({ error: err.message });
  }
}