<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/buchung.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$buchung = new Buchung($db);
 
// query products
$stmt = $buchung->read();
$num = $stmt->rowCount();

 
// check if more than 0 record found
if($num>0){
 
    // products array
    $buchung_arr=array();
    $buchung_arr["records"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $buchung_item=array(
            "buchungID" => $buchungID,
            "huetteID" => $huetteID,
            "anrede" => $anrede,
            "firmenname" => $firmenname,
            "erwachseneMitglieder" => $erwachseneMitglieder,
            "erwachseneNichtMitglieder" => $erwachseneNichtMitglieder,
            "jugendlicheMitglieder" => $jugendlicheMitglieder,
            "jugendlicheNichtMitglieder" => $jugendlicheNichtMitglieder,
            "kinderMitglieder" => $kinderMitglieder,
            "kinderNichtMitglieder" => $kinderNichtMitglieder,
            "checkinDatum" => $checkinDatum,
            "checkoutDatum" => $checkoutDatum,
            "buchungsDatum" => $buchungsDatum,
            "preis" => $preis,
            "freiplaetzeErwMitglied" => $freiplaetzeErwMitglied,
            "freiplaetzeJgdMitglied" => $freiplaetzeJgdMitglied,
            "freiplaetzeKindMitglied" => $freiplaetzeKindMitglied,
            "freiplaetzeErwNichtMitglied" => $freiplaetzeErwNichtMitglied,
            "freiplaetzeJgdNichtMitglied" => $freiplaetzeJgdNichtMitglied,
            "freiplaetzeKindNichtMitglied" => $freiplaetzeKindNichtMitglied,
            "anzahlung" => $anzahlung,
            "preisErwachsene" => $preisErwachsene,
            "preisJugendliche" => $preisJugendliche,
            "preisKinder" => $preisKinder,
            "zahlungsDatum" => $zahlungsDatum,
            "zahlungsartID" => $zahlungsartID,
            "verpflegung" => $verpflegung,
            "bvorname" => $bvorname,
            "bnachname" => $bnachname,
            "bgeburtsdatum" => $bgeburtsdatum,
            "badresse" => $badresse,
            "bplz" => $bplz,
            "bort" => $bort,
            "btelefonnummer" => $btelefonnummer,
            "bmail" => $bmail,
            "bmitglied" => $bmitglied,
            "bemerkung" => $bemerkung,
            "bestaetigt" => $bestaetigt,
            "rgversendet" => $rgversendet,
            "bezahlt" => $bezahlt
        );
 
        array_push($buchung_arr["records"], $buchung_item);
    }
 
    echo json_encode($buchung_arr);
}
 
else{
    echo json_encode(
        array("message" => "Keine Buchungen gefunden")
    );
}
?>