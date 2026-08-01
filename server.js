const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin ko Message Bhejein</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white font-sans flex items-center justify-center min-h-screen p-4">
    <div class="bg-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 class="text-2xl font-bold mb-2">Admin ko Message Bhejein</h1>
        <p class="text-gray-400 text-sm mb-3">Aapka koi bhi personal detail public nahi hoga.</p>
        
        <div class="mb-4 space-y-1 text-sm text-amber-400">
            <p class="font-bold">🍿 Movie Name</p>
            <p class="font-bold">📅 Release Date Example: 2023-09-21</p>
            <p class="font-bold">🔈 Audio Example: Hindi</p>
        </div>

        <form id="msgForm" class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Aapka Naam:</label>
                <input type="text" id="name" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Aapka Email ya Contact:</label>
                <input type="text" id="contact" required placeholder="Email ya Telegram ID" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Aapka Message:</label>
                <textarea id="message" rows="4" required class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200">Message Bhejein</button>
        </form>
        <p id="status" class="text-center text-sm mt-3 text-green-400 hidden"></p>
    </div>

    <script>
        document.getElementById('msgForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const contact = document.getElementById('contact').value;
            const message = document.getElementById('message').value;
            const status = document.getElementById('status');

            status.textContent = "Bhej raha hai...";
            status.classList.remove('hidden');

            try {
                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, contact, message })
                });
                
                if(response.ok) {
                    status.textContent = "Message successfully bhej diya gaya hai!";
                    document.getElementById('msgForm').reset();
                } else {
                    status.textContent = "Kuch error aayi, dubara try karein.";
                }
            } catch (err) {
                status.textContent = "Server error!";
            }
        });
    </script>
</body>
</html>);
});

app.post('/send-message', async (req, res) => {
    const { name, contact, message } = req.body;
    
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        console.log(New Message from ${name} (${contact}): ${message});
        return res.status(200).send({ success: true });
    }

         const text = 📥 *Naya Message Aaya Hai!*\n\n👤 *Naam:* ${name}\n📞 *Contact:* ${contact}\n💬 *Message:* \n${message};

    try {
        const telegramUrl = https://api.telegram.org/bot${BOT_TOKEN}/sendMessage;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });

        const data = await response.json();
        if (data.ok) {
            res.status(200).send({ success: true });
        } else {
            res.status(500).send({ success: false });
        }
    } catch (error) {
        res.status(500).send({ success: false });
    }
});

app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
