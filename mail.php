<?php 

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

foreach ( $_POST as $key => $value ) {
    $message .= "
    " . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
        <td style='width: 30%; padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
        <td style='width: 60%; padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
    </tr>
    ";
}

//$mail->SMTPDebug = 3;                             

$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'smtp.inbox.ru'; 
$mail->SMTPAuth = true;                  
$mail->Username = 'site-m@inbox.ru'; 
$mail->Password = '1IytYrAydU&1'; 
$mail->SMTPSecure = 'ssl'; 
$mail->Port = 465;

$mail->setFrom('site-m@inbox.ru');
$mail->addAddress('89094433003@mail.ru');     
$mail->isHTML(true);                       

$mail->Subject = 'Бетон - заявка с сайта';
$mail->Body    = $message;
$mail->AltBody = '';

if (!empty($message)) {
    if(!$mail->send()) {
        echo 'error';
    } else {
    
    }
}

?>
