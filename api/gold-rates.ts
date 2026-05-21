import supabase from './_supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      // Get current rate
      const { data: currentRate, error: rateError } = await supabase
        .from('gold_rates')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (rateError && rateError.code !== 'PGRST116') throw rateError;

      // Get last 7 days history
      const { data: history, error: historyError } = await supabase
        .from('gold_rate_history')
        .select('*')
        .order('date', { ascending: true })
        .limit(7);

      if (historyError) throw historyError;

      return res.status(200).json({ 
        current: currentRate || null,
        history: history || [] 
      });
    }

    if (req.method === 'POST') {
      const { rate_24k } = req.body;
      
      if (!rate_24k || rate_24k < 0) {
        return res.status(400).json({ error: 'Valid 24K rate is required' });
      }

      const today = new Date().toISOString().split('T')[0];

      // Update or insert current rate
      const { data: existingRate } = await supabase
        .from('gold_rates')
        .select('id')
        .limit(1)
        .single();

      let result;
      if (existingRate) {
        const { data, error } = await supabase
          .from('gold_rates')
          .update({ 
            rate_24k,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRate.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('gold_rates')
          .insert({ rate_24k })
          .select()
          .single();
        if (error) throw error;
        result = data;
      }

      // Add to history (upsert to avoid duplicates for same date)
      await supabase
        .from('gold_rate_history')
        .upsert(
          { date: today, rate_24k },
          { onConflict: 'date' }
        );

      return res.status(200).json(result);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Gold rates API error:', err);
    res.status(500).json({ error: err.message });
  }
}