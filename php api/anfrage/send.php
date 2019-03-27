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

    // PHPMailer setup:
    $mail = new PHPMailer(true);    // true enables exceptions

    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    $anrede = $data->anrede;
    
    $startDatum = DateTime::createFromFormat('Y-m-d', $data->startDatum);   // convert dates to a datetime object for later formatting
    $endDatum = DateTime::createFromFormat('Y-m-d', $data->endDatum);
    $kontaktperson = $data->kontaktperson;
    $kontaktTelefonnummer = $data->telefonnummer;
    $kontaktMail = $data->mail;
    $personen = $data->personen;

    $message = 'Sie haben eine neue Buchungsanfrage erhalten!<br><br>';
    $message .= 'Anrede: '.$anrede.'<br>';

    if ($anrede == "Firma") {
        $message .= 'Name: '.$data->firmenname.'<br>';
        $message .= 'Adresse: '.$data->firmenadresse.'<br>';
        $message .= 'PLZ: '.$data->firmenplz.'<br>';
        $message .= 'Ort: '.$data->firmenort.'<br>';
    }

    $message .= 'Kontaktperson: '.$kontaktperson.'<br>';
    $message .= 'Telefonnummer: '.$kontaktTelefonnummer.'<br>';
    $message .= 'Mail: '.$kontaktMail.'<br><br>';

    $message .= 'Personenanzahl: '.$personen.'<br>';
    $message .= 'Davon Mitglieder: '.$data->mitglieder.'<br><br>';

    $message .= 'Gewünschtes Anreisedatum: '.date_format($startDatum,"d.m.Y").'<br>';
    $message .= 'Gewünschtes Abreisedatum: '.date_format($endDatum,"d.m.Y").'<br><br>';

    $message .= 'Bemerkung: '.$data->bemerkung.'<br><br>';

    $message .= '- Naturfreunde Buchungstool';



    // create database connection
    $database = new Database();
    $db = $database->getConnection();

    // get tenant's mail address
    $huette = new Huette($db);
    $huette->huetteID = $data->huetteID;
    $huette->readOne();

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
        $mail->AddAddress($huette->mail);
        $mail->Subject = "Buchungsanfrage";

        // $string = nl2br($data->message);
        // $mail->Body = "$string";
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

}
?>