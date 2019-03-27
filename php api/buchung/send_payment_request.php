<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../objects/huette.php';
require_once('../lib/phpmailer/PHPMailerAutoload.php');

// get database connection
include_once '../config/database.php';

 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $formatter = new NumberFormatter('de_AT',  NumberFormatter::CURRENCY);

    // PHPMailer setup:
    $mail = new PHPMailer(true);    // true enables exceptions

    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    // create database connection
    $database = new Database();
    $db = $database->getConnection();

    // get tenant's mail address
    $huette = new Huette($db);
    $huette->huetteID = $data->huetteID;
    $huette->readOne();
    
    $price = $data->preis / 2;
    $logourl = $huette->logourl;

    $message = 'Guten Tag '.$data->bvorname.' '.$data->bnachname.',<br><br><br>';

    $message .= 'vielen Dank für Ihre Buchung!<br>';
    $message .= 'Um Ihre Buchung fix für Sie reservieren zu können, bitten wir um Überweisung der Anzahlung binnen einer Woche ab Erhalt dieser Email auf folgendes Konto:<br><br>';
    
    $message .= 'Anzahlungsbetrag: <b>'.$formatter->formatCurrency($price, 'EUR').'</b><br>';
    $message .= 'Konto: <b>'.$huette->kontoinhaber.'</b><br>';
    $message .= 'IBAN: <b>'.$huette->IBAN.'</b><br>';
    $message .= 'BIC: <b>'.$huette->BIC.'</b><br><br>';

    $message .= 'Bei Einlangen der Zahlung erhalten Sie eine endgültige Bestätigung Ihrer Reservierung per Email.<br><br>';
    $message .= 'Mit freundlichen Grüßen, <br><br><br>';

    $message .= '<b style="color: #1d4e17;">'.$huette->paechtername.'</b><br>';
    $message .= '<p style="color: #58a932; margin: 0">Pächter '.$huette->name.'</p>';

    // $message .= "<p style='margin: 10px 0px;'><img src=\"cid:logo_huette\" width=\"200\"/></p>";
    $message .= "<p style='margin: 10px 0px;'><img src=\"$logourl\" width='200'/></p>";

    $message .= '<p style="color: #58a932; margin: 0;">············································································</p>';
    $message .= ''.$huette->adresse.', '.$huette->plz.' '.$huette->ort.'<br>';
    $message .= 'T: '.$huette->telefonnummer.'<br>';
    $message .= 'E: '.$huette->mail.'<br>';
    $message .= 'W: '.$huette->website.'<br>';

    try {
        $mail->CharSet ="UTF-8";
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPSecure = 'ssl';
        $mail->Host = 'smtp.gmail.com'; // change this to your own host
        $mail->Port = '465';
        $mail->isHTML();
        $mail->Username = 'naturfreundelinz@gmail.com'; // change this
        $mail->Password = 'nfl!nz77';                   // change this
        $mail->SetFrom('noreply@naturfreunde.at', 'noreply@naturfreunde.at');
        
        // set buchung property values
        $mail->AddAddress($data->bmail);
        $mail->Subject = "Zahlungsaufforderung";

        // $string = nl2br($data->message);
        // $mail->Body = "$string";
        $mail->Body = $message;
        // $mail->AddEmbeddedImage('../images/logo.jpg', 'logo_huette');

        // send the mail
        if($mail->Send()) {
            echo '{';
                echo '"success": "Sent message."';
            echo '}';
        } else {
            echo '{';
                echo '"problem": "Unable to send mail."';
            echo '}';
        }
    } catch (Exception $e) {
        echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
    }

}
?>