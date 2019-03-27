<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
 
// include database and object file
include_once '../objects/huette.php';
include_once '../config/database.php';
include_once '../objects/buchung.php';

require_once('../lib/phpmailer/PHPMailerAutoload.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // PHPMailer setup:
    $mail = new PHPMailer(true);    // true enables exceptions

    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    // create database connection
    $database = new Database();
    $db = $database->getConnection();

    $buchung = new Buchung($db);

    $buchung->buchungID = $data->buchungID;

    if ($buchung->confirm()) {
        $huette = new Huette($db);
        $huette->huetteID = $data->huetteID;
        $huette->readOne();
        $logourl = $huette->logourl;
        
        $price = $data->preis / 2;

        $message = 'Guten Tag '.$data->bvorname.' '.$data->bnachname.',<br><br><br>';

        $message .= 'vielen Dank für Ihre Zahlung!<br>';
        $message .= 'Die Anzahlung ist bei uns eingegangen und Ihre Buchung wurde fix für Sie reserviert.<br><br>';
        
        $message .= 'Mit freundlichen Grüßen, <br><br><br>';

        $message .= '<b style="color: #1d4e17;">'.$huette->paechtername.'</b><br>';
        $message .= '<p style="color: #58a932; margin: 0">Pächter '.$huette->name.'</p>';
    
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
            $mail->Subject = "Buchungsbestätigung";

            $mail->Body = $message;
            
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

    } else {
        echo '{';
            echo '"message": "Unable to create Booking."';
        echo '}';
    }
    

}
?>