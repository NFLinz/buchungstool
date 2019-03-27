<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate buchung object
include_once '../objects/buchung.php';
include_once '../objects/zimmerzuteilung.php';

 
$database = new Database();
$db = $database->getConnection();
 
$buchung = new Buchung($db);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // set buchung property values
    $buchung->huetteID = $data->huetteID;
    
    $buchung->anrede = $data->anrede;
    if (isset($data->firmenname)) {
        $buchung->firmenname = $data->firmenname;
    } else {
        $buchung->firmenname = null;
    }

    $buchung->erwachseneMitglieder = $data->erwachseneMitglieder;
    $buchung->erwachseneNichtMitglieder = $data->erwachseneNichtMitglieder;
    $buchung->jugendlicheMitglieder = $data->jugendlicheMitglieder;
    $buchung->jugendlicheNichtMitglieder = $data->jugendlicheNichtMitglieder;
    $buchung->kinderMitglieder = $data->kinderMitglieder;
    $buchung->kinderNichtMitglieder = $data->kinderNichtMitglieder;

    $buchung->checkinDatum = $data->checkinDatum;
    $buchung->checkoutDatum = $data->checkoutDatum;
    $buchung->buchungsDatum = date('Y-m-d H:i:s');
    $buchung->preis = $data->preis;
    $buchung->anzahlung = $data->preis * 0.5;
    $buchung->zahlungsDatum = date('Y-m-d');
    $buchung->zahlungsartID = $data->zahlungsartID;
    $buchung->verpflegung = $data->verpflegung;
    $buchung->bvorname = $data->bvorname;
    $buchung->bnachname = $data->bnachname;

    if (isset($data->bgeburtsdatum)) {
        $buchung->bgeburtsdatum = $data->bgeburtsdatum;
    } else {
        $buchung->bgeburtsdatum = null;
    }

    if (isset($data->badresse)) {
        $buchung->badresse = $data->badresse;
    } else {
        $buchung->badresse = $data->firmenadresse;
    }

    if (isset($data->bplz)) {
        $buchung->bplz = $data->bplz;
    } else {
        $buchung->bplz = $data->firmenplz;
    }

    if (isset($data->bort)) {
        $buchung->bort = $data->bort;
    } else {
        $buchung->bort = $data->firmenort;
    }

    $buchung->btelefonnummer = $data->btelefonnummer;
    $buchung->bmail = $data->bmail;

    if (isset($data->bmitglied)) {
        $buchung->bmitglied = $data->bmitglied;
    } else {
        $buchung->bmitglied = null;
    }

    $buchung->bemerkung = $data->bemerkung;

    $buchung->zimmer = array_values($data->zimmerArray)[0];

    // create the buchung
    if($buchung->create()){

        // zimmerzuteilung erstellen
        foreach ($data->zimmerArray as $zimmer) {
            $zimmerzuteilung = new Zimmerzuteilung($db);
            $zimmerzuteilung->buchungID = $buchung->buchungID;
            $zimmerzuteilung->zimmerID = $zimmer->zimmerID;
            $zimmerzuteilung->create();
        }

        // create array
        $buchung_arr=array(
            "buchungID" => $buchung->buchungID,
            "huetteID" => $buchung->huetteID,
            "anrede" => $buchung->anrede,
            "firmenname" => $buchung->firmenname,
            "erwachseneMitglieder" => $buchung->erwachseneMitglieder,
            "erwachseneNichtMitglieder" => $buchung->erwachseneNichtMitglieder,
            "jugendlicheMitglieder" => $buchung->jugendlicheMitglieder,
            "jugendlicheNichtMitglieder" => $buchung->jugendlicheNichtMitglieder,
            "kinderMitglieder" => $buchung->kinderMitglieder,
            "kinderNichtMitglieder" => $buchung->kinderNichtMitglieder,        
            "checkinDatum" => $buchung->checkinDatum,
            "checkoutDatum" => $buchung->checkoutDatum,
            "buchungsDatum" => $buchung->buchungsDatum,
            "preis" => $buchung->preis,
            "preisErwachsene" => $buchung->preisErwachsene,
            "preisJugendliche" => $buchung->preisJugendliche,
            "preisKinder" => $buchung->preisKinder,
            "zahlungsDatum" => $buchung->zahlungsDatum,
            "zahlungsartID" => $buchung->zahlungsartID,
            "verpflegung" => $buchung->verpflegung,
            "bvorname" => $buchung->bvorname,
            "bnachname" => $buchung->bnachname,
            "bgeburtsdatum" => $buchung->bgeburtsdatum,
            "badresse" => $buchung->badresse,
            "bplz" => $buchung->bplz,
            "bort" => $buchung->bort,
            "btelefonnummer" => $buchung->btelefonnummer,
            "bmail" => $buchung->bmail,
            "bmitglied" => $buchung->bmitglied,
            "bemerkung" => $buchung->bemerkung
        );
        
        // make it json format
        print_r(json_encode($buchung_arr));
    }
    
    // if unable to create the buchung, tell the user
    else{
        echo '{';
            echo '"message": "Unable to create Booking."';
        echo '}';
    }
}
?>