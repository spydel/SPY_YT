const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Yeh array saari requests ko temporarily store karega (Database ki tarah)
let requestsList = [];

// 1. Member Page (Form)
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie Request Form</title>
    <script src="https://tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white font-sans flex items-center justify-center min-h-screen p-4">
    <div class="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <h1 class="text-2xl font-bold mb-1 text-center text-amber-400">🎬 Movie Request</h1>
        <p class="text-gray-400 text-xs mb-4 text-center">Aapka koi bhi personal detail public nahi hoga.</p>
        
        <div class="bg-slate-900 p-3 rounded-xl mb-4 text-xs space-y-1 text-amber-300 border border-slate-700">
            <p class="font-bold">🍿 Movie Name</p>
            <p class="font-bold">📅 Release Date Example: 2023-09-21</p>
            <p class="font-bold">🔈 Audio Example: Hindi</p>
        </div>

        <form id="msgForm" class="space-y-3">
            <div>
                <label class="block text-xs font-medium text-gray-300 mb-1">Aapka Naam:</label>
                <input type="text" id="name" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-300 mb-1">Aapka WhatsApp ya Telegram Number/ID:</label>
                <input type="text" id="contact" required placeholder="Jisse admin aapko contact kar sake..." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500">
            </div>
            <div>
                <label class="block text-xs font-medium text-gray-300 mb-1">Movie Details:</label>
                <textarea id="message" rows="3" required placeholder="Movie ka naam, release date aur audio likhein..." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"></textarea>
            </div>
            <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 rounded-lg transition duration-200 text-sm shadow-md">Request Bhejein</button>
        </form>

        <div id="statusBox" class="mt-4 hidden p-3 rounded-xl bg-slate-900 border border-amber-500/50 text-xs text-amber-200 leading-relaxed space-y-2">
            <p id="statusText"></p>
        </div>
    </div>

    <script>
        document.getElementById('msgForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const contact = document.getElementById('contact').value;
            const message = document.getElementById('message').value;
            const statusBox = document.getElementById('statusBox');
            const statusText = document.getElementById('statusText');

            statusText.textContent = "Bhej raha hai...";
            statusBox.classList.remove('hidden');

            try {
                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, contact, message })
                });
                
                if(response.ok) {
                    statusText.innerHTML = "✅ <b>Apka Movie Request complete ho jayega 30 minutes ma. But aapko Movie Channel ka link Aapke Friend ko share karna padega aur uska screenshot send karo.</b><br><br>👉 <a href='https://whatsapp.com/channel/0029Vb6cJETKGGGClbSzWb2a' target='_blank' class='text-amber-400 underline font-bold'>WhatsApp Channel Join Karein</a>";
                    document.getElementById('msgForm').reset();
                } else {
                    statusText.textContent = "Kuch error aayi, dubara try karein.";
                }
            } catch (err) {
                statusText.textContent = "Server error!";
            }
        });
    </script>
</body>
</html>`);
});

// 2. Admin Panel Page (`/admin`)
app.get('/admin', (req, res) => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <script src="https://tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-white font-sans p-6">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-amber-400">👑 Admin Dashboard - Movie Requests</h1>
        <div class="space-y-4">`;

    if (requestsList.length === 0) {
        html += `<p class="text-gray-400 bg-slate-900 p-4 rounded-xl border border-slate-800">Abhi tak koi request nahi aayi hai.</p>`;
    } else {
        requestsList.slice().reverse().forEach((reqItem, index) => {
            html += `
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <div class="flex justify-between items-center text-xs text-gray-400">
                    <span>#${requestsList.length - index}</span>
                    <span class="text-amber-400 font-semibold">${reqItem.time}</span>
                </div>
                <p><b>Naam:</b> ${reqItem.name}</p>
                <p><b>Contact (WhatsApp/Telegram):</b> <span class="text-green-400">${reqItem.contact}</span></p>
                <p><b>Request Details:</b> ${reqItem.message}</p>
                <p><b>Admin Reply / Status:</b> <span class="text-blue-400 font-bold">${reqItem.reply || 'Pending (30 mins)'}</span></p>
                
                <form action="/admin-reply" method="POST" class="flex gap-2 mt-3">
                    <input type="hidden" name="id" value="${reqItem.id}">
                    <input type="text" name="replyText" placeholder="Reply likhein (jaise: Movie ready hai...)" required class="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-xs font-bold">Send Reply</button>
                </form>
            </div>`;
        });
    }

    html += `</div></div></body></html>`;
    res.send(html);
});

// Form submit hone par data save karna
app.post('/send-message', async (req, res) => {
    const { name, contact, message } = req.body;
    
    const newReq = {
        id: Date.now(),
        name,
        contact,
        message,
        reply: "Pending...",
        time: new Date().toLocaleString()
    };
    
    requestsList.push(newReq);

    // Telegram par bhi notification bhejna (agar token aur chat ID dali hai)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (BOT_TOKEN && CHAT_ID) {
        const text = `🎬 *Nayi Movie Request Aayi Hai!*\n\n👤 *Naam:* ${name}\n📱 *Contact:* ${contact}\n💬 *Details:* \n${message}`;
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'Markdown' })
            });
        } catch (e) {}
    }

    res.status(200).send({ success: true });
});

// Admin jab reply bhejega
app.post('/admin-reply', (req, res) => {
    const { id, replyText } = req.body;
    const item = requestsList.find(r => r.id == id);
    if (item) {
        item.reply = replyText;
    }
    res.redirect('/admin');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
