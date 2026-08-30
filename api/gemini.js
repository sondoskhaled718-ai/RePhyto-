module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, image } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح GEMINI_API_KEY غير معرف في Vercel' });
  }

  try {
    // إعداد أجزاء الطلب (نص + صورة إن وجدت)
    const parts = [];

    if (prompt) {
      parts.push({ text: prompt });
    }

    if (image) {
      // استخراج نوع الـ MIME وبيانات الـ Base64
      const matches = image.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        parts.push({
          inline_data: {
            mime_type: matches[1],
            data: matches[2]
          }
        });
      }
    }

    if (parts.length === 0) {
      return res.status(400).json({ error: 'يرجى إرسال صورة أو نص للتحليل' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: parts }]
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      const reply = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ reply: reply });
    } else {
      return res.status(500).json({ error: 'فشل استخراج النتيجة من نموذج الذكاء الاصطناعي', details: data });
    }
  } catch (err) {
    return res.status(500).json({ error: 'حدث خطأ أثناء الاتصال بالسيرفر', details: err.message });
  }
};
