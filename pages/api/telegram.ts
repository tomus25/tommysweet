export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ ok:false, error:'Method not allowed' });

  const { message } = req.body || {};
  if (!message)
    return res.status(400).json({ ok:false, error:'Missing message' });

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN = 8394517052:AAG-eGTk4hPGsku-ok6u8NGPeDLDxWc2lNc; // from @BotFather
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID = -1003142619538;   // your chat/channel/user id
  if (!BOT_TOKEN || !CHAT_ID)
    return res.status(500).json({ ok:false, error:'Missing BOT_TOKEN or CHAT_ID' });

  const sendUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const resp = await fetch(sendUrl, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    })
  });

  const json = await resp.json();
  if (!json.ok)
    return res.status(500).json({ ok:false, error: json.description || 'Telegram API error' });

  return res.status(200).json({ ok:true });
}
