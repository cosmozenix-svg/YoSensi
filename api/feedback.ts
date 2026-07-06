export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rating, settings, brand, model } = req.body;
    
    // Note: On Vercel, the filesystem is read-only. We cannot write to 'feedback.json'.
    // In a production environment, you would save this to a database (like Firebase or Postgres).
    // For now, we'll log it so you can see it in your Vercel logs.
    console.log('--- NEW FEEDBACK RECEIVED ---');
    console.log(`Device: ${brand} ${model}`);
    console.log(`Rating: ${rating}`);
    console.log(`Settings:`, settings);
    console.log('-----------------------------');

    res.status(200).json({ success: true, note: 'Logged to Vercel console' });
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: error.message || 'Failed to save feedback.' });
  }
}
