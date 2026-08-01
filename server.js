const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

// Direct HTML code server ke andar hi likh diya hai taaki file missing ki koi error hi na aaye!
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>S-Pay - Payment Gateway</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-white text-gray-900 font-sans">
    <nav class="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div class="text-xl font-bold flex items-center gap-2">
            <span class="w-3 h-3 bg-purple-600 rounded-full inline-block"></span> S-Pay-Getaway
        </div>
        <div>
            <a href="https://t.me/" target="_blank" class="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium text-sm">Contact Support</a>
        </div>
    </nav>
    <section class="text-center py-20 px-4">
        <span class="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold">Trusted payment gateway</span>
        <h1 class="text-4xl md:text-6xl font-extrabold mt-4 tracking-tight">Grow more. Do more. <br><span class="text-gray-900">Be more.</span></h1>
        <p class="text-gray-600 mt-4 max-w-xl mx-auto">Payment solutions built to work for your business — fast checkouts, secure transactions, and tools that scale with you.</p>
        <div class="mt-8 flex justify-center gap-4">
            <button class="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-xl shadow-md">Get Started</button>
            <button class="bg-white border border-gray-300 hover:bg-gray-50 text-black font-semibold px-6 py-3 rounded-xl shadow-sm">Contact Us</button>
        </div>
    </section>
</body>
</html>`);
});

app.listen(PORT, () => {
    console.log('Server is running successfully');
});
