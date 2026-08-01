<?php
$file = 'messages.txt';

// Agar aap baad me custom reply save karna chahein
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['save_reply'])) {
    $target_id = $_POST['msg_id'];
    $custom_reply = trim($_POST['custom_reply']);
    
    $lines = file_exists($file) ? file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
    $new_lines = [];
    
    foreach($lines as $line) {
        $parts = explode("|||", $line);
        if($parts[0] == $target_id) {
            $parts[3] = $custom_reply; // Update reply
            $parts[4] = "Replied by Admin"; // Status change
        }
        $new_lines[] = implode("|||", $parts);
    }
    file_put_contents($file, implode("\n", $new_lines) . "\n");
}

$lines = file_exists($file) ? file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
$messages = [];

foreach($lines as $line) {
    $parts = explode("|||", $line);
    if(count($parts) >= 6) {
        $messages[] = [
            'id' => $parts[0],
            'name' => $parts[1],
            'movie_details' => $parts[2],
            'reply' => $parts[3],
            'status' => $parts[4],
            'time' => $parts[5]
        ];
    }
}
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
        textarea { width: 100%; padding: 8px; background: #0f172a; border: 1px solid #475569; color: #fff; border-radius: 4px; box-sizing: border-box; margin-top: 5px; }
        .btn { background: #10b981; color: white; border: none; padding: 6px 12px; margin-top: 5px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Movie Requests Dashboard</h2>
        <?php if(empty($messages)) { echo "<p>Abhi tak koi request nahi aayi hai.</p>"; } ?>
        
        <?php foreach($messages as $m): ?>
            <div class="card">
                <h3>Naam: <?= htmlspecialchars($m['name']) ?> <span style="font-size: 12px; color: #f59e0b;">(<?= $m['status'] ?>)</span></h3>
                <p><strong>Request Details:</strong><br><?= nl2br(htmlspecialchars($m['movie_details'])) ?></p>
                <small>Samay: <?= $m['time'] ?></small>
                
                <form method="POST" style="margin-top: 10px;">
                    <input type="hidden" name="msg_id" value="<?= $m['id'] ?>">
                    <label style="font-size: 12px; color: #38bdf8;">Current / Custom Reply (Aap ise badal bhi sakte hain):</label>
                    <textarea name="custom_reply" rows="3" required><?= htmlspecialchars($m['reply']) ?></textarea>
                    <button type="submit" name="save_reply" class="btn">Update Reply</button>
                </form>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
