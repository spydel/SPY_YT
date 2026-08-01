<?php
$file = 'messages.txt';
$success = "";

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['send_msg'])) {
    $name = trim($_POST['name']);
    $contact = trim($_POST['contact']);
    $message = trim($_POST['message']);
    
    if(!empty($name) && !empty($contact) && !empty($message)) {
        $time = date('Y-m-d H:i:s');
        // Unique ID, Name, Contact, Message, Status, Reply format
        $entry = uniqid() . "|||" . $name . "|||" . $contact . "|||" . $message . "|||Pending|||" . $time . "\n";
        file_put_contents($file, $entry, FILE_APPEND | LOCK_EX);
        $success = "Aapka message admin tak successfully bhej diya gaya hai!";
    }
}
?>
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin se Sampark Karein</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #0f172a; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .box { background: #1e293b; padding: 25px; border-radius: 10px; width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; color: #94a3b8; font-size: 14px; }
        input, textarea { width: 100%; padding: 10px; background: #0f172a; border: 1px solid #334155; color: #fff; border-radius: 5px; box-sizing: border-box; }
        button { background: #3b82f6; color: white; border: none; padding: 12px; width: 100%; border-radius: 5px; font-weight: bold; cursor: pointer; }
        button:hover { background: #2563eb; }
        .msg { color: #34d399; font-size: 14px; text-align: center; margin-bottom: 15px; background: #065f46; padding: 8px; border-radius: 4px; }
    </style>
</head>
<body>
<div class="box">
    <h2>Admin ko Message Bhejein</h2>
    <p style="font-size: 13px; color: #94a3b8; margin-bottom: 15px;">Aapka koi bhi personal detail public nahi hoga.</p>
    <?php if($success) echo "<div class='msg'>$success</div>"; ?>
    <form method="POST">
        <div class="form-group">
            <label>Aapka Naam:</label>
            <input type="text" name="name" required>
        </div>
        <div class="form-group">
            <label>Aapka Email ya Contact:</label>
            <input type="text" name="contact" placeholder="Email ya Telegram ID" required>
        </div>
        <div class="form-group">
            <label>Aapka Message:</label>
            <textarea name="message" rows="4" required></textarea>
        </div>
        <button type="submit" name="send_msg">Message Bhejein</button>
    </form>
</div>
</body>
</html>
