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
    <title>Movie Request</title>
    <script src="https://tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white flex items-center justify-center min-h-screen p-2">
    <div class="bg-slate-800 p-4 rounded-xl shadow-lg w-full max-w-sm border border-slate-700">
        <h1 class="text-lg font-bold text-center text-amber-400 mb-1">🎬 Movie Request</h1>
        
        <p class="text-[11px] text-amber-300 bg-slate-900 p-2 rounded-lg mb-2 border border-slate-700">
            🍿 Naam | 📅 2023-09-21 | 🔈 Hindi
        </p>

        <form id="f" class="space-y-2">
            <div>
                <input type="text" id="name" required placeholder="Aapka Naam" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500">
            </div>
            <div>
                <input type="text" id="contact" required placeholder="WhatsApp / Telegram Number" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500">
            </div>
            <div>
                <textarea id="message" rows="2" required placeholder="Movie Details (Naam, Date, Audio)" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"></textarea>
            </div>
            <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-2 rounded-lg text-xs">Request Bhejein</button>
        </form>

        <div id="box" class="mt-3 hidden p-2 rounded-lg bg-slate-900 border border-amber-500/50 text-[11px] text-amber-200">
            <p id="txt"></p>
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

            const res = await fetch('/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, contact, message })
            });
            
            if(res.ok) {
                txt.innerHTML = "✅ <b>Request 30 min mein puri hogi.</b><br>Pehle friend ko share karein:<br>👉 <a href='https://whatsapp.com/channel/0029Vb6cJETKGGGClbSzWb2a' target='_blank' class='text-amber-400 underline font-bold'>WhatsApp Channel Join Karein</a>";
                document.getElementById('f').reset();
            } else {
                txt.textContent = "Error aayi, dubara try karein.";
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
    const { name, contact, message } = req.body;
    requestsList.push({ id: Date.now(), name, contact, message, reply: "Pending..." });

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (BOT_TOKEN && CHAT_ID) {
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: `🎬 Nayi Request:\nNaam: ${name}\nContact: ${contact}\nDetails: ${message}`, parse_mode: 'Markdown' })
            });
        } catch (e) {}
    }
    res.status(200).send({ success: true });
});

app.post('/admin-reply', (req, res) => {
    const { id, replyText } = req.body;
    const item = requestsList.find(r => r.id == id);
    if (item) item.reply = replyText;
    res.redirect('/admin');
});

app.listen(PORT, () => console.log(`Running on ${PORT}`));
