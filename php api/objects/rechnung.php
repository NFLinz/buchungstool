<?php

include_once '../config/database.php';
include_once 'huette.php';
include_once 'buchung.php';
include_once 'zimmer.php';
include_once 'zimmerzuteilung.php';

require_once('../lib/phpmailer/PHPMailerAutoload.php');
require_once '../lib/dompdf/lib/html5lib/Parser.php';
require_once '../lib/dompdf/lib/php-font-lib/src/FontLib/Autoloader.php';
require_once '../lib/dompdf/lib/php-svg-lib/src/autoload.php';
require_once '../lib/dompdf/src/Autoloader.php';
Dompdf\Autoloader::register();

// reference the Dompdf namespace
use Dompdf\Dompdf;

class Rechnung {
 
    // database connection and table name
    private $conn;
    private $table_name = "rechnung";
 
    // object properties
    public $rechnungID;
    public $huetteID;
    public $buchungID;
    public $datum;

    // external properties
    public $bvorname;
    public $bnachname;

    // mail properties
    public $receiver;
    public $subject;
    public $message;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    function getHTMLInvoice() {
        $database = new Database();
        $db = $database->getConnection();

        // create huette object and fill its parameters
        $huette = new Huette($db);
        $huette->huetteID = $this->huetteID;
        $huette->readOne();

        // create buchung object and fill its parameters
        $buchung = new Buchung($db);
        $buchung->buchungID = $this->buchungID;
        $buchung->readOne();

        // get one room and fill its parameters
        $zimmerzuteilung = new Zimmerzuteilung($db);
        $zimmerzuteilung->buchungID = $buchung->buchungID;
        $firstRoomID = $zimmerzuteilung->returnFirstZimmerIDForBooking();

        $zimmer = new Zimmer($db);
        $zimmer->zimmerID = $firstRoomID;
        $zimmer->readOne();

        // get number of nights:
        $date1 = new DateTime($buchung->checkinDatum);
        $date2 = new DateTime($buchung->checkoutDatum);
        $numberOfNights= $date2->diff($date1)->format("%a"); 

        // invoice date format:
        // $this->datum = date_create($this->datum);

        // get prices for the stay
        $totalPersons = $buchung->erwachseneMitglieder + $buchung->jugendlicheMitglieder + 
                        $buchung->kinderMitglieder + $buchung->erwachseneNichtMitglieder + 
                        $buchung->jugendlicheNichtMitglieder + $buchung->kinderNichtMitglieder;
        $verpflegungGesamtpreis = 0;
        if (strcmp($buchung->verpflegung, "Frühstück") === 0) {
            $verpflegungGesamtpreis = $totalPersons * $huette->fruehstueckspreis * $numberOfNights;
        } else {
            $verpflegungGesamtpreis = $totalPersons * $huette->halbpensionspreis * $numberOfNights;
        }

        $memberDiscount = 0.9;

        $erwachseneMitgliedNights = $buchung->erwachseneMitglieder * $numberOfNights;
        $erwachseneMitgliedGesamtpreis = $buchung->preisErwachsene * $erwachseneMitgliedNights * $memberDiscount;

        $jugendlicheMitgliedNights = $buchung->jugendlicheMitglieder * $numberOfNights;
        $jugendlicheMitgliedGesamtpreis = $buchung->preisJugendliche * $jugendlicheMitgliedNights * $memberDiscount;

        $kinderMitgliedNights = $buchung->kinderMitglieder * $numberOfNights;
        $kinderMitgliedGesamtpreis = 0;

        $erwachseneNichtMitgliedNights = $buchung->erwachseneNichtMitglieder * $numberOfNights;
        $erwachseneNichtMitgliedGesamtpreis = $buchung->preisErwachsene * $erwachseneNichtMitgliedNights;

        $jugendlicheNichtMitgliedNights = $buchung->jugendlicheNichtMitglieder * $numberOfNights;
        $jugendlicheNichtMitgliedGesamtpreis = $buchung->preisJugendliche * $jugendlicheNichtMitgliedNights;

        $kinderNichtMitgliedNights = $buchung->kinderNichtMitglieder * $numberOfNights;
        $kinderNichtMitgliedGesamtpreis = 0;

        $total =    $verpflegungGesamtpreis + $erwachseneMitgliedGesamtpreis + 
                    $jugendlicheMitgliedGesamtpreis + $kinderMitgliedGesamtpreis +
                    $erwachseneNichtMitgliedGesamtpreis + $jugendlicheNichtMitgliedGesamtpreis +
                    $kinderNichtMitgliedGesamtpreis;

        $anzahlung = $buchung->anzahlung;

        $gesamtpreisOhneAbzuege = $buchung->getTotalPriceWithoutReductions();
        $gesamtpreisInklAbzuege = $buchung->getTotalPrice();
        $summeDerReduktionen = $gesamtpreisOhneAbzuege - $gesamtpreisInklAbzuege;
        $gesamtpreisBrutto = $gesamtpreisInklAbzuege - $anzahlung;
        $gesamtpreisNetto = $gesamtpreisBrutto / 1.1;
        $steuer = $gesamtpreisBrutto - $gesamtpreisNetto;

        $itemCounter = 0;
        $formatter = new NumberFormatter('de_AT',  NumberFormatter::CURRENCY);

        $date;
        if (is_string($this->datum)) {
            $convdate = date_create($this->datum); // convert string to correct format
            $date = $convdate->format('d.m.Y');
        } else {
            $date = $this->datum->format('d.m.Y');  // object is already a datetime object
        }

        $html_code = '
        <!doctype html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <title>Rechnung</title>
            <link rel="stylesheet" href="invoice.css">
        </head>
        <body>

        <table width="100%">
            <tr>
                <td valign="top"><img src="../images/logo_linz.png" alt="logo" width="150"/></td>
                <td align="right">
                    <h3>'.$huette->name.'</h3>
                    <pre>
                        '.$huette->paechtername.'
                        '.$huette->adresse.'
                        '.$huette->plz.' '.$huette->ort.'
                        '.$huette->telefonnummer.'
                        '.$huette->mail.'
                    </pre>
                </td>
            </tr>
        </table>

        <table width="100%">
            <tr>
                <td>'.$buchung->bvorname.' '.$buchung->bnachname.'</td>
            </tr>
            <tr>
                <td>'.$buchung->badresse.'</td>
            </tr>
            <tr>
                <td>'.$buchung->bplz.' '.$buchung->bort.'</td>
            </tr>
        </table>

        <br>
        <p><strong>Rechnungsdatum:</strong> '.$date.'</p>

        <h1>Rechnung Nr. '.$this->rechnungID.'</h1>

        <table width="100%">
            <thead style="background-color: lightgray;">
            <tr>
                <th>#</th>
                <th>Beschreibung</th>
                <th style="text-align: right;">Nächte</th>
                <th style="text-align: right;">Personen</th>
                <th style="text-align: right;">Preis pro Einheit €</th>
                <th style="text-align: right;">Gesamt €</th>
            </tr>
            </thead>
            <tbody>
        ';


        if (strcmp($buchung->verpflegung, "Frühstück") === 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Frühstück</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$totalPersons.'</td>
                <td align="right">'.$formatter->formatCurrency($huette->fruehstueckspreis, 'EUR').'</td>
                <td align="right">'.$formatter->formatCurrency($verpflegungGesamtpreis, 'EUR').'</td>
            </tr>
            ';
        } else {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Halbpension</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$totalPersons.'</td>
                <td align="right">'.$formatter->formatCurrency($huette->halbpensionspreis, 'EUR').'</td>
                <td align="right">'.$formatter->formatCurrency($verpflegungGesamtpreis, 'EUR').'</td>
            </tr>
            ';
        }

        if ($erwachseneMitgliedNights > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Übernachtung Erwachsene (Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->erwachseneMitglieder.'</td>
                <td align="right">'.$formatter->formatCurrency($buchung->preisErwachsene * $memberDiscount, 'EUR').'</td>
                <td align="right">'.$formatter->formatCurrency($erwachseneMitgliedGesamtpreis, 'EUR').'</td>
            </tr>
            ';
        }

        if ($buchung->freiplaetzeErwMitglied > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Freiplatz Erwachsene (Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->freiplaetzeErwMitglied.'</td>
                <td align="right">'.$formatter->formatCurrency($buchung->preisErwachsene * $memberDiscount, 'EUR').'</td>
                <td align="right">- '.$formatter->formatCurrency($buchung->preisErwachsene * $memberDiscount * $buchung->freiplaetzeErwMitglied, 'EUR').'</td>
            </tr>
            ';
        }

        if ($erwachseneNichtMitgliedNights > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Übernachtung Erwachsene (Nicht-Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->erwachseneNichtMitglieder.'</td>
                <td align="right">'.$formatter->formatCurrency($buchung->preisErwachsene, 'EUR').'</td>
                <td align="right">'.$formatter->formatCurrency($erwachseneNichtMitgliedGesamtpreis, 'EUR').'</td>
            </tr>
            ';
        }

        if ($buchung->freiplaetzeErwNichtMitglied > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Freiplatz Erwachsene (Nicht-Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->freiplaetzeErwNichtMitglied.'</td>
                <td align="right">'.$formatter->formatCurrency($buchung->preisErwachsene, 'EUR').'</td>
                <td align="right">- '.$formatter->formatCurrency($buchung->preisErwachsene * $buchung->freiplaetzeErwNichtMitglied, 'EUR').'</td>
            </tr>
            ';
        }

        if ($jugendlicheMitgliedNights > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Übernachtung Jugendliche (Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->jugendlicheMitglieder.'</td>
                <td align="right">'.$formatter->formatCurrency($buchung->preisJugendliche * $memberDiscount, 'EUR').'</td>
                <td align="right">'.$formatter->formatCurrency($jugendlicheMitgliedGesamtpreis, 'EUR').'</td>
            </tr>
            ';
        }

        if ($buchung->freiplaetzeJgdMitglied > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Freiplatz Jugendliche (Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->freiplaetzeJgdMitglied.'</td>
                <td align="right">'.$formatter->formatCurrency($buchung->preisJugendliche * $memberDiscount, 'EUR').'</td>
                <td align="right">- '.$formatter->formatCurrency($buchung->preisJugendliche * $memberDiscount * $buchung->freiplaetzeJgdMitglied, 'EUR').'</td>
            </tr>
            ';
        }

        if ($jugendlicheNichtMitgliedNights > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Übernachtung Jugendliche (Nicht-Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->jugendlicheNichtMitglieder.'</td>
                <td align="right">'.$formatter->formatCurrency($buchung->preisJugendliche, 'EUR').'</td>
                <td align="right">'.$formatter->formatCurrency($jugendlicheNichtMitgliedGesamtpreis, 'EUR').'</td>
            </tr>
            ';
        }

        if ($buchung->freiplaetzeJgdNichtMitglied > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Freiplatz Jugendliche (Nicht-Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->freiplaetzeJgdNichtMitglied.'</td>
                <td align="right">'.$formatter->formatCurrency($buchung->preisJugendliche, 'EUR').'</td>
                <td align="right">- '.$formatter->formatCurrency($buchung->preisJugendliche * $buchung->freiplaetzeJgdNichtMitglied, 'EUR').'</td>
            </tr>
            ';
        }

        if ($kinderMitgliedNights > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Übernachtung Kinder (Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->kinderMitglieder.'</td>
                <td align="right">€ 0,00</td>
                <td align="right">'.$formatter->formatCurrency($kinderMitgliedGesamtpreis, 'EUR').'</td>
            </tr>
            ';
        }

        if ($buchung->freiplaetzeKindMitglied > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Freiplatz Kinder (Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->freiplaetzeKindMitglied.'</td>
                <td align="right">€ 0,00</td>
                <td align="right">- € 0,00</td>
            </tr>
            ';
        }

        if ($kinderNichtMitgliedNights > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Übernachtung Kinder (Nicht-Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->kinderNichtMitglieder.'</td>
                <td align="right">€ 0,00</td>
                <td align="right">'.$formatter->formatCurrency($kinderNichtMitgliedGesamtpreis, 'EUR').'</td>
            </tr>
            ';
        }

        if ($buchung->freiplaetzeKindNichtMitglied > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Freiplatz Kinder (Nicht-Mitglied)</td>
                <td align="right">'.$numberOfNights.'</td>
                <td align="right">'.$buchung->freiplaetzeKindNichtMitglied.'</td>
                <td align="right">€ 0,00</td>
                <td align="right">- € 0,00</td>
            </tr>
            ';
        }

        if ($anzahlung > 0) {
            $itemCounter++;
            $html_code .= '
            <tr>
                <th scope="row">'.$itemCounter.'</th>
                <td>Anzahlung</td>
                <td align="right"></td>
                <td align="right"></td>
                <td align="right"></td>
                <td align="right">- '.$formatter->formatCurrency($anzahlung, 'EUR').'</td>
            </tr>
            ';
        }
            
        $html_code .= '
            </tbody>

            <tfoot>
                <tr>
                    <td colspan="4"></td>
                    <td align="right">Netto €</td>
                    <td align="right">'.$formatter->formatCurrency($gesamtpreisNetto, 'EUR').'</td>
                </tr>
                <tr>
                    <td colspan="4"></td>
                    <td align="right">10 % USt €</td>
                    <td align="right">'.$formatter->formatCurrency($steuer, 'EUR').'</td>
                </tr>
                <tr>
                    <td colspan="4"></td>
                    <td align="right">Gesamt (brutto) €</td>
                    <td align="right" class="gray">'.$formatter->formatCurrency($gesamtpreisBrutto, 'EUR').'</td>
                </tr>
            </tfoot>
        </table>
        ';

        if ($summeDerReduktionen > 0) {
            $itemCounter++;
            $html_code .= '
            <br>
            <p style="font-size: 14px;">
                Sie haben durch Ihre Buchung
                <strong>'.$formatter->formatCurrency($summeDerReduktionen, 'EUR').'</strong>
                im Vergleich zum Normalpreis gespart.
            </p>
            ';
        }

        $html_code .= '
        <div style="text-align: left; font-size: 14px;">
            <p>Bitte überweisen Sie den ausstehenden Betrag binnen einer Woche ab Rechnungsdatum auf folgendes Konto:</p>
            <p>Konto: <b>'.$huette->kontoinhaber.'</b><p>
            <p>IBAN: <b>'.$huette->IBAN.'</b></p>
            <p>BIC: <b>'.$huette->BIC.'</b></p>
        </div>


        </body>
        </html>
        ';

        return $html_code;
    }

    function send() {
        $database = new Database();
        $db = $database->getConnection();

        // create huette object and fill its parameters
        $huette = new Huette($db);
        $huette->huetteID = $this->huetteID;
        $huette->readOne();

        $logourl = $huette->logourl;

        // create buchung object and fill its parameters
        $buchung = new Buchung($db);
        $buchung->buchungID = $this->buchungID;
        $buchung->readOne();

        $this->receiver = $buchung->bmail;

        // invoice date format:
        $this->datum = date_create($this->datum);

        $html_code = $this->getHTMLInvoice();

        // instantiate and use the dompdf class
        $dompdf = new Dompdf();
        $dompdf->loadHtml($html_code);

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        $file_name = md5(rand()) . '.pdf';
        $file = $dompdf->output();
        file_put_contents($file_name, $file);


        // PHPMailer setup:
        $mail = new PHPMailer(true);    // true enables exceptions

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
            

            // get posted data
            $data = json_decode(file_get_contents("php://input"));
            
            //$newUserID = $buchung->getUserID();

            // set buchung property values
            $mail->AddAddress($this->receiver);
            $mail->Subject = "Rechnung";

            
            $this->message = 'Guten Tag '.$buchung->bvorname.' '.$buchung->bnachname.',<br><br><br>';
            $this->message .= 'vielen Dank für Ihre Buchung!<br>';
            $this->message .= 'Im Anhang befindet sich die Rechnung zu Ihrem Aufenthalt.<br><br>';
            $this->message .= 'Mit freundlichen Grüßen, <br><br><br>';

            $this->message .= '<b style="color: #1d4e17;">'.$huette->paechtername.'</b><br>';
            $this->message .= '<p style="color: #58a932; margin: 0">Pächter '.$huette->name.'</p>';
        
            $this->message .= "<p style='margin: 10px 0px;'><img src=\"$logourl\" width='200'/></p>";
        
            $this->message .= '<p style="color: #58a932; margin: 0;">············································································</p>';
            $this->message .= ''.$huette->adresse.', '.$huette->plz.' '.$huette->ort.'<br>';
            $this->message .= 'T: '.$huette->telefonnummer.'<br>';
            $this->message .= 'E: '.$huette->mail.'<br>';
            $this->message .= 'W: '.$huette->website.'<br>';
        
            $mail->Body = $this->message;
            
            $mail->addAttachment($file_name, 'rechnung.pdf');    // Optional name
            //$mail->addStringAttachment("rechnung", 'myfile.pdf');

            //$buchung->buchungsDatum = date('Y-m-d H:i:s');
            //$buchung->zahlungsDatum = date('Y-m-d');

            
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

        $buchung->setInvoiceAsSent();

    }





    function downloadPDF() {
        $database = new Database();
        $db = $database->getConnection();

        $html_code = $this->getHTMLInvoice();

        // instantiate and use the dompdf class
        $dompdf = new Dompdf();
        $dompdf->loadHtml($html_code);

        // (Optional) Setup the paper size and orientation
        $dompdf->setPaper('A4', 'portrait');

        // Render the HTML as PDF
        $dompdf->render();

        $dompdf->stream();
    }








    // read bookings
    function read() {
     
        // select all query
        $query = "SELECT
            r.*, b.bvorname, b.bnachname
            FROM
                rechnung r, buchung b
                WHERE r.buchungID = b.buchungID
            ";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }

    // read one specific entry
    function readOne(){
     
        // query to read single record
        $query = $query = "SELECT * FROM ".$this->table_name." r
                    WHERE r.rechnungID = ?
                    LIMIT 0,1";
     
        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        $this->rechnungID=htmlspecialchars(strip_tags($this->rechnungID));
     
        // bind id of product to be updated
        $stmt->bindParam(1, $this->rechnungID);
     
        // execute query
        $stmt->execute();
     
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
     
        // set values to object properties
        $this->rechnungID = $row['rechnungID'];
        $this->huetteID = $row['huetteID'];
        $this->buchungID = $row['buchungID'];
        $this->datum = $row['datum'];
    }

    function getInvoiceForBooking(){
     
        // query to read single record
        $query = $query = "SELECT * FROM ".$this->table_name." r
                    WHERE r.buchungID = ?
                    LIMIT 0,1";
     
        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        $this->buchungID=htmlspecialchars(strip_tags($this->buchungID));
     
        // bind id of product to be updated
        $stmt->bindParam(1, $this->buchungID);
     
        // execute query
        $stmt->execute();
     
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
     
        // set values to object properties
        $this->rechnungID = $row['rechnungID'];
        $this->huetteID = $row['huetteID'];
        $this->buchungID = $row['buchungID'];
        $this->datum = $row['datum'];
    }
    
    // create new entry
    function create(){
     
        // query to insert record
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    huetteID=:huetteID, buchungID=:buchungID, datum=:datum
                    ";
     
        // prepare query
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->huetteID=htmlspecialchars(strip_tags($this->huetteID));
        $this->buchungID=htmlspecialchars(strip_tags($this->buchungID));
        $this->datum=htmlspecialchars(strip_tags($this->datum));


     
        // bind values
        $stmt->bindParam(":huetteID", $this->huetteID);
        $stmt->bindParam(":buchungID", $this->buchungID);
        $stmt->bindParam(":datum", $this->datum);
     
        // execute query
        if($stmt->execute()){
            // $this->rechnungID = $this->conn->insert_id;
            return true;
        }
     
        return false;
    }

    function delete(){
     
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE rechnungID = ?";
     
        // prepare query
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->rechnungID=htmlspecialchars(strip_tags($this->rechnungID));
     
        // bind id of record to delete
        $stmt->bindParam(1, $this->rechnungID);
     
        // execute query
        if($stmt->execute()){
            return true;
        }
     
        return false;
         
    }

}
?>