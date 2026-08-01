const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    
    // Check karein ki index.html file exist karti hai ya nahi
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        // Agar file nahi mili toh yeh fallback message dikhega taaki error na aaye
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>S-Pay - Payment Gateway</title>
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body class="bg-white text-gray-900 font-sans text-center py-20">
                <h1 class="text-4xl font-extrabold">S-Pay Gateway is Live! 🚀</h1>
                <p class="text-gray-600 mt-4">Aapki index.html file root directory mein upload nahi hui hai.</p>
                <p class="text-sm text-gray-500 mt-2">Kripya GitHub repository mein check karein ki index.html file hai ya nahi.</p>
            </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
