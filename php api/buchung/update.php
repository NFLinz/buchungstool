<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/buchung.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare product object
$buchung = new Buchung($db);
 
// get id of product to be edited
$data = json_decode(file_get_contents("php://input"));
 
// set ID property of product to be edited
$buchung->buchungID = $data->buchungID;

$buchung->readOne();

if ($data->anrede !== "") {
    $buchung->anrede = $data->anrede;
}

if ($data->erwachseneMitglieder !== "") {
    $buchung->erwachseneMitglieder = $data->erwachseneMitglieder;
}

if ($data->erwachseneNichtMitglieder !== "") {
    $buchung->erwachseneNichtMitglieder = $data->erwachseneNichtMitglieder;
}

if ($data->jugendlicheMitglieder !== "") {
    $buchung->jugendlicheMitglieder = $data->jugendlicheMitglieder;
}

if ($data->jugendlicheNichtMitglieder !== "") {
    $buchung->jugendlicheNichtMitglieder = $data->jugendlicheNichtMitglieder;
}

if ($data->kinderMitglieder !== "") {
    $buchung->kinderMitglieder = $data->kinderMitglieder;
}

if ($data->kinderNichtMitglieder !== "") {
    $buchung->kinderNichtMitglieder = $data->kinderNichtMitglieder;
}


if ($data->preis !== "") {
    $buchung->preis = $data->preis;
}

if ($data->freiplaetzeErwMitglied !== "") {
    $buchung->freiplaetzeErwMitglied = $data->freiplaetzeErwMitglied;
}

if ($data->freiplaetzeJgdMitglied !== "") {
    $buchung->freiplaetzeJgdMitglied = $data->freiplaetzeJgdMitglied;
}

if ($data->freiplaetzeKindMitglied !== "") {
    $buchung->freiplaetzeKindMitglied = $data->freiplaetzeKindMitglied;
}

if ($data->freiplaetzeErwNichtMitglied !== "") {
    $buchung->freiplaetzeErwNichtMitglied = $data->freiplaetzeErwNichtMitglied;
}

if ($data->freiplaetzeJgdNichtMitglied !== "") {
    $buchung->freiplaetzeJgdNichtMitglied = $data->freiplaetzeJgdNichtMitglied;
}

if ($data->freiplaetzeKindNichtMitglied !== "") {
    $buchung->freiplaetzeKindNichtMitglied = $data->freiplaetzeKindNichtMitglied;
}


if ($data->preisErwachsene !== "") {
    $buchung->preisErwachsene = $data->preisErwachsene;
}

if ($data->preisJugendliche !== "") {
    $buchung->preisJugendliche = $data->preisJugendliche;
}

if ($data->preisKinder !== "") {
    $buchung->preisKinder = $data->preisKinder;
}

if ($data->verpflegung !== "") {
    $buchung->verpflegung = $data->verpflegung;
}

if ($data->bvorname !== "") {
    $buchung->bvorname = $data->bvorname;
}

if ($data->bnachname !== "") {
    $buchung->bnachname = $data->bnachname;
}

if ($data->bgeburtsdatum !== "") {
    $buchung->bgeburtsdatum = $data->bgeburtsdatum;
}

if ($data->badresse !== "") {
    $buchung->badresse = $data->badresse;
}

if ($data->bplz !== "") {
    $buchung->bplz = $data->bplz;
}

if ($data->bort !== "") {
    $buchung->bort = $data->bort;
}

if ($data->btelefonnummer !== "") {
    $buchung->btelefonnummer = $data->btelefonnummer;
}

if ($data->bmail !== "") {
    $buchung->bmail = $data->bmail;
}

if ($data->bemerkung !== "") {
    $buchung->bemerkung = $data->bemerkung;
}

if ($data->firmenname !== "") {
    $buchung->firmenname = $data->firmenname;
}

if ($data->startDatum !== "") {
    $buchung->checkinDatum = $data->startDatum;
}

if ($data->endDatum !== "") {
    $buchung->checkoutDatum = $data->endDatum;
}

$buchung->bestaetigt = $data->bestaetigt;
$buchung->rgversendet = $data->rgversendet;
$buchung->bezahlt = $data->bezahlt;


// update
if($buchung->update()){
    echo '{';
        echo '"message": "Booking was updated."';
    echo '}';
}
 
// if unable to update the product, tell the user
else{
    echo '{';
        echo '"message": "Unable to update booking."';
    echo '}';
}
?>