const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let requestsList = [];

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin ko Message Bhejein</title>
    <script src="https://tailwindcss.com"></script>
</head>
<body class="bg-[#0b132b] text-white flex items-center justify-center min-h-screen p-3">
    <div class="bg-[#1c2541] p-4 rounded-2xl shadow-xl w-full max-w-sm border border-slate-700">
        <h1 class="text-lg font-bold mb-0.5">Admin ko Message Bhejein</h1>
        <p class="text-gray-400 text-[10px] mb-3">Aapka koi bhi personal detail public nahi hoga.</p>

        <form id="f" class="space-y-2.5">
            <div>
                <label class="block text-[11px] text-gray-300 mb-1">Aapka Naam:</label>
                <input type="text" id="name" required class="w-full bg-[#0b132b] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-[11px] text-gray-300 mb-1">WhatsApp ya Telegram Number / ID:</label>
                <input type="text" id="contact" required placeholder="Number ya Telegram ID daliye..." class="w-full bg-[#0b132b] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-[11px] text-gray-300 mb-1">Aapka Message:</label>
                <textarea id="message" rows="2" required placeholder="Movie details likhein..." class="w-full bg-[#0b132b] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl text-xs transition duration-200 shadow-md">Message Bhejein</button>
        </form>

        <div id="box" class="mt-3 hidden p-2.5 rounded-xl bg-[#0b132b] border border-blue-500/50 text-[11px] text-amber-200">
            <p id="txt" class="text-center"></p>
        </div>
    </div>

    <script>
        document.getElementById('f').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const contact = document.getElementById('contact').value;
            const message = document.getElementById('message').value;
            const box = document.getElementById('box');
            const txt = document.getElementById('txt');

            txt.textContent = "Bhej raha hai...";
            box.classList.remove('hidden');

            try {
                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, contact, message })
                });
                
                if(response.ok) {
                    txt.innerHTML = "✅ <b>Request 30 min mein puri hogi.</b><br>Pehle friend ko share karein:<br>👉 <a href='https://whatsapp.com/channel/0029Vb6cJETKGGGClbSzWb2a' target='_blank' class='text-amber-400 underline font-bold'>WhatsApp Channel Join Karein</a>";
                    document.getElementById('f').reset();
                } else {
                    txt.textContent = "Kuch error aayi, dubara try karein.";
                }
            } catch (err) {
                txt.textContent = "Server connection error!";
            }
        });
    </script>
</body>
</html>`);
});

app.get('/admin', (req, res) => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin</title><script src="https://tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white p-4 text-xs">
    <div class="max-w-xl mx-auto space-y-3">
        <h1 class="text-xl font-bold text-amber-400 mb-4">👑 Admin Requests</h1>`;

    if (requestsList.length === 0) {
        html += `<p class="text-gray-400">Koi request nahi hai.</p>`;
    } else {
        requestsList.slice().reverse().forEach((item) => {
            html += `
            <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                <p><b>Naam:</b> ${item.name} | <b>Contact:</b> <span class="text-green-400">${item.contact}</span></p>
                <p><b>Details:</b> ${item.message}</p>
                <p><b>Status:</b> <span class="text-blue-400">${item.reply}</span></p>
                <form action="/admin-reply" method="POST" class="flex gap-2 mt-2">
                    <input type="hidden" name="id" value="${item.id}">
                    <input type="text" name="replyText" placeholder="Reply likhein..." required class="flex-1 bg-slate-950 border border-slate-700 rounded p-1 text-white">
                    <button type="submit" class="bg-blue-600 px-3 py-1 rounded font-bold">Send</button>
                </form>
            </div>`;
        });
    }
    html += `</div></body></html>`;
    res.send(html);
});

app.post('/send-message', async (req, res) => {
    try {
        const { name, contact, message } = req.body;
        requestsList.push({ id: Date.now(), name, contact, message, reply: "Pending..." });

        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
        if (BOT_TOKEN && CHAT_ID) {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: `🎬 Nayi Request:\nNaam: ${name}\nContact: ${contact}\nDetails: ${message}`, parse_mode: 'Markdown' })
            });
        }
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false });
    }
});

app.post('/admin-reply', (req, res) => {
    const { id, replyText } = req.body;
    const item = requestsList.find(r => r.id == id);
    if (item) item.reply = replyText;
    res.redirect('/admin');
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));
