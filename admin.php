<?php
$db = new PDO('sqlite:messages.db');

// Reply save karne ke liye code
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['send_reply'])) {
    $msg_id = $_POST['msg_id'];
    $reply_text = $_POST['reply_text'];
    
    $stmt = $db->prepare("UPDATE msgs SET reply = ?, status = 'Replied' WHERE id = ?");
    $stmt->execute([$reply_text, $msg_id]);
}

$messages = $db->query("SELECT * FROM msgs ORDER BY id DESC")->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard & Reply Panel</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #0f172a; color: #fff; padding: 20px; }
        .container { max-width: 700px; margin: 0 auto; }
        .card { background: #1e293b; padding: 20px; margin-bottom: 15px; border-radius: 8px; border-left: 4px solid #3b82f6; }
        .replied { border-left-color: #10b981; }
        h3 { margin: 0 0 5px 0; color: #38bdf8; font-size: 18px; }
        p { margin: 8px 0; }
        small { color: #94a3b8; }
        .reply-box { margin-top: 10px; background: #0f172a; padding: 10px; border-radius: 5px; border: 1px solid #334155; }
        textarea { width: 100%; padding: 8px; background: #1e293b; border: 1px solid #475569; color: #fff; border-radius: 4px; box-sizing: border-box; margin-top: 5px; }
        .btn { background: #10b981; color: white; border: none; padding: 6px 12px; margin-top: 5px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .badge { background: #f59e0b; color: #000; padding: 2px 6px; font-size: 11px; border-radius: 4px; font-weight: bold; }
        .badge-done { background: #10b981; color: #fff; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Admin Dashboard (Member Messages)</h2>
        <?php if(empty($messages)) { echo "<p>Abhi tak koi message nahi aaya hai.</p>"; } ?>
        
        <?php foreach($messages as $m): ?>
            <div class="card <?php echo ($m['status'] == 'Replied') ? 'replied' : ''; ?>">
                <h3>Naam: <?= htmlspecialchars($m['name']) ?> 
                    <span class="badge <?php echo ($m['status'] == 'Replied') ? 'badge-done' : ''; ?>">
                        <?= $m['status'] ?>
                    </span>
                </h3>
                <p><strong>Contact/Email:</strong> <span style="color: #fbbf24;"><?= htmlspecialchars($m['contact']) ?></span></p>
                <p><strong>Message:</strong> <?= nl2br(htmlspecialchars($m['message'])) ?></p>
                <small>Aane ka Samay: <?= $m['time'] ?></small>
                
                <div class="reply-box">
                    <?php if(!empty($m['reply'])): ?>
                        <p style="color: #34d399; margin: 0;"><strong>Aapka Reply:</strong> <?= nl2br(htmlspecialchars($m['reply'])) ?></p>
                    <?php else: ?>
                        <form method="POST">
                            <input type="hidden" name="msg_id" value="<?= $m['id'] ?>">
                            <label style="font-size: 12px; color: #94a3b8;">Is member ko reply likhein:</label>
                            <textarea name="reply_text" rows="2" placeholder="Yahan apna jawab likhein..." required></textarea>
                            <button type="submit" name="send_reply" class="btn">Reply Save Karein</button>
                        </form>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</body>
</html>
