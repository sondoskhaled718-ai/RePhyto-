<div style="max-width: 500px; margin: 50px auto; font-family: sans-serif; text-align: right; direction: rtl;">
    <h3>اسألي Gemini</h3>
    <input type="text" id="userQuestion" placeholder="اكتبي سؤالكِ هنا..." style="width: 80%; padding: 10px;">
    <button onclick="askAI()" style="padding: 10px;">إرسال</button>
    <div id="aiResponse" style="margin-top: 20px; color: #333; white-space: pre-wrap;">الإجابة ستظهر هنا...</div>
</div>

<script>
async function askAI() {
    const question = document.getElementById('userQuestion').value;
    const responseResult = document.getElementById('aiResponse');
    
    if(!question) return alert("الرجاء كتابة سؤال أولاً!");
    responseResult.innerText = "جاري التفكير...";

    try {
        // استبدلي هذا الرابط برابط Vercel الخاص بكِ مع إضافة /api/gemini في نهايته
        const vercelUrl = 'https://vercel.app'; 

        const response = await fetch(vercelUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: question })
        });
        
        const data = await response.json();
        responseResult.innerText = data.reply;
    } catch (error) {
        responseResult.innerText = "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.";
    }
}
</script>
