<?php
$file = 'messages.txt';

$lines = file_exists($file) ? file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
$messages = [];

foreach($lines as $line) {
    $parts = explode("|||", $line);
    if(count($parts) >= 6) {
        $messages[] = [
            'name' => $parts[1],
            'movie_details' => $parts[2],
            'time' => $parts[5]
        ];
    }
}
// Latest request sabse upar dikhane ke liye
$messages = array_reverse($messages);
?>
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Movie Requests</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #0f172a; color: #fff; padding: 20px; }
        .container { max-width: 700px; margin: 0 auto; }
        .card { background: #1e293b; padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
        h3 { margin: 0 0 8px 0; color: #38bdf8; font-size: 18px; }
        p { margin: 8px 0; line-height: 1.5; white-space: pre-wrap; background: #0f172a; padding: 10px; border-radius: 5px; border: 1px solid #334155; }
        small { color: #94a3b8; font-size: 12px; }
        h2 { text-align: center; color: #f8fafc; margin-bottom: 25px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>🎬 Aayi Hui Movie Requests</h2>
        <?php if(empty($messages)) { echo "<p style='text-align:center;'>Abhi tak koi request nahi aayi hai.</p>"; } ?>
        
        <?php foreach($messages as $m): ?>
            <div class="card">
                <h3>Naam: <?= htmlspecialchars($m['name']) ?></h3>
                <p><strong>Movie Details:</strong><br><?= htmlspecialchars($m['movie_details']) ?></p>
                <small>📅 Aane ka Samay: <?= $m['time'] ?></small>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
