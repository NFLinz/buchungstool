<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/buchung.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare huette object
$buchung = new Buchung($db);
 
// set ID property of huette to be edited
$buchung->buchungID = isset($_GET['id']) ? $_GET['id'] : die();
 
// read the details of huette to be edited
$buchung->readOne();

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
    "freiplaetzeErwMitglied" => $buchung->freiplaetzeErwMitglied,
    "freiplaetzeJgdMitglied" => $buchung->freiplaetzeJgdMitglied,
    "freiplaetzeKindMitglied" => $buchung->freiplaetzeKindMitglied,
    "freiplaetzeErwNichtMitglied" => $buchung->freiplaetzeErwNichtMitglied,
    "freiplaetzeJgdNichtMitglied" => $buchung->freiplaetzeJgdNichtMitglied,
    "freiplaetzeKindNichtMitglied" => $buchung->freiplaetzeKindNichtMitglied,
    "anzahlung" => $buchung->anzahlung,
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
    "bemerkung" => $buchung->bemerkung,
    "bestaetigt" => $buchung->bestaetigt,
    "rgversendet" => $buchung->rgversendet,
    "bezahlt" => $buchung->bezahlt
);
 
// make it json format
print_r(json_encode($buchung_arr));
?>