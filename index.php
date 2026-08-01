<?php
$file = 'messages.txt';
$success_msg = "";

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['send_msg'])) {
    $name = trim($_POST['name']);
    $movie_details = trim($_POST['movie_details']);
    
    if(!empty($name) && !empty($movie_details)) {
        $time = date('Y-m-d H:i:s');
        $auto_reply = "Apka Movie Request complete ho jayaga 30 minets ma But aapko Movie Channel ka link Aapke Freind ko share karna paraga aur uska screenshot sent karo. WhatsApp Channel: https://whatsapp.com/channel/0029Vb6cJETKGGGClbSzWb2a";
        
        // Format: ID ||| Name ||| Request/Message ||| Admin Custom Reply ||| Status ||| Time
        $entry = uniqid() . "|||" . $name . "|||" . $movie_details . "|||" . $auto_reply . "|||Pending|||" . $time . "\n";
        file_put_contents($file, $entry, FILE_APPEND | LOCK_EX);
        
        $success_msg = "<b>Request Successfully Send Ho Gayi!</b><br><br><b>Admin Auto-Reply:</b><br>Apka Movie Request complete ho jayaga 30 minets ma But aapko Movie Channel ka link Aapke Freind ko share karna paraga aur uska screenshot sent karo.<br><br>👉 <a href='https://whatsapp.com/channel/0029Vb6cJETKGGGClbSzWb2a' target='_blank' style='color: #38bdf8;'>Join WhatsApp Channel</a>";
    }
}
?>
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Movie Request Center</title>
    <style>
        body { font-family: Arial, sans-serif; background-color: #0f172a; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .box { background: #1e293b; padding: 25px; border-radius: 10px; width: 100%; max-width: 420px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .form-group { margin-bottom: 15px; }
        .form-group label { display: block; margin-bottom: 5px; color: #94a3b8; font-size: 14px; }
        input, textarea { width: 100%; padding: 10px; background: #0f172a; border: 1px solid #334155; color: #fff; border-radius: 5px; box-sizing: border-box; }
        button { background: #3b82f6; color: white; border: none; padding: 12px; width: 100%; border-radius: 5px; font-weight: bold; cursor: pointer; }
        button:hover { background: #2563eb; }
        .msg { color: #34d399; font-size: 13px; text-align: left; margin-bottom: 15px; background: #065f46; padding: 12px; border-radius: 5px; line-height: 1.4; }
        .format-box { background: #0f172a; padding: 10px; border-radius: 5px; border: 1px dashed #475569; margin-bottom: 15px; font-size: 13px; color: #fbbf24; }
    </style>
</head>
<body>
<div class="box">
    <h2>Movie Request Karein</h2>
    <p style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">Aapka koi bhi personal detail public nahi hoga.</p>
    
    <div class="format-box">
        <strong>🍿 Movie Name:</strong><br>
        <strong>📅 Release Date Example:</strong> 2023-09-21<br>
        <strong>🔈 Audio Example:</strong> Hindi
    </div>

    <?php if($success_msg) echo "<div class='msg'>$success_msg</div>"; ?>
    
    <form method="POST">
        <div class="form-group">
            <label>Aapka Naam:</label>
            <input type="text" name="name" required>
        </div>
        <div class="form-group">
            <label>Movie Details (Upar diye format me likhein):</label>
            <textarea name="movie_details" rows="4" placeholder="🍿 Movie Name: ...&#10;📅 Release Date: ...&#10;🔈 Audio: ..." required></textarea>
        </div>
        <button type="submit" name="send_msg">Request Bhejein</button>
    </form>
</div>
</body>
</html>
