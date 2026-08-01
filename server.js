const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
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
        <p class="text-gray-400 text-sm mb-4">Aapka koi bhi personal detail public nahi hoga.</p>
        
        <!-- Bold Examples Added Here -->
        <div class="mb-4 space-y-1 text-sm">
            <p class="font-bold">📅 Release Example: 2023-09-21</p>
            <p class="font-bold">🔈 Audio Example: Hindi</p>
        </div>

        <form class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Aapka Naam:</label>
                <input type="text" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Aapka Email ya Contact:</label>
                <input type="text" placeholder="Email ya Telegram ID" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-1">Aapka Message:</label>
                <textarea rows="4" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"></textarea>
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200">Message Bhejein</button>
        </form>
    </div>
</body>
</html>`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
