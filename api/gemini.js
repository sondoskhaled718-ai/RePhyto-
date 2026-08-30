// api/gemini.js
export default async function handler(req, res) {
    // إعدادات السماح بتبادل البيانات بين الموقع والسيرفر (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'الطريقة غير مسموح بها' });
    }

    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        // الاتصال المباشر والآمن بنموذج جيميناي
        const response = await fetch(`https://googleapis.com{apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        // استخراج النص البرمجي الصحيح من رد جوجل المتشعب
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply: reply });
        } else {
            console.error('رد غير متوقع من جيميناي:', data);
            return res.status(500).json({ error: 'فشل في قراءة رد جيميناي المستلم' });
        }

    } catch (error) {
        console.error('خطأ في السيرفر:', error);
        return res.status(500).json({ error: 'حدث خطأ في الاتصال بالذكاء الاصطناعي' });
    }
}
