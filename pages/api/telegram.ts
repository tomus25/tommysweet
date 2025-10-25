export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing or invalid message' });
    }

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (!BOT_TOKEN || !CHAT_ID) {
      console.error('[telegram] Missing env vars', { hasToken: !!BOT_TOKEN, hasChat: !!CHAT_ID });
      return res.status(500).json({ ok: false, error: 'Missing BOT_TOKEN or CHAT_ID' });
    }

    // Без Markdown, чтобы исключить ошибки форматирования (* _ [] ...)
    const sendUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const tgResp = await fetch(sendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message.toString().slice(0, 3900), // safety
        disable_web_page_preview: true
      })
    });

    const json = await tgResp.json().catch(() => ({}));
    if (!tgResp.ok || !json.ok) {
      console.error('[telegram] Telegram API error', { status: tgResp.status, json });
      return res.status(500).json({
        ok: false,
        error: json?.description || `Telegram API HTTP ${tgResp.status}`
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[telegram] Handler error', err);
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
}
