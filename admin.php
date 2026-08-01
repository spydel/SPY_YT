<?php
$file = 'messages.txt';

// Agar file nahi hai toh empty array
$lines = file_exists($file) ? file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
$messages = [];

foreach($lines as $line) {
    $parts = explode("|||", $line);
    if(count($parts) >= 6) {
        $messages[] = [
            'id' => $parts[0],
            'name' => $parts[1],
            'contact' => $parts[2],
            'message' => $parts[3],
            'status' => $parts[4],
            'time' => $parts[5]
        ];
    }
}
// Latest message upar dikhane ke liye
$messages = array_reverse($messages);
?>
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #0f172a; color: #fff; padding: 20px; }
        .container { max-width: 700px; margin: 0 auto; }
        .card { background: #1e293b; padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        h3 { margin: 0 0 5px 0; color: #38bdf8; font-size: 18px; }
        p { margin: 8px 0; }
        small { color: #94a3b8; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Admin Dashboard (Member Messages)</h2>
        <?php if(empty($messages)) { echo "<p>Abhi tak koi message nahi aaya hai.</p>"; } ?>
        
        <?php foreach($messages as $m): ?>
            <div class="card">
                <h3>Naam: <?= htmlspecialchars($m['name']) ?></h3>
                <p><strong>Contact:</strong> <span style="color: #fbbf24;"><?= htmlspecialchars($m['contact']) ?></span></p>
                <p><strong>Message:</strong> <?= nl2br(htmlspecialchars($m['message'])) ?></p>
                <small>Aane ka Samay: <?= $m['time'] ?></small>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
