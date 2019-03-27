<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/huette.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare huette object
$huette = new Huette($db);
 
// set ID property of huette to be edited
$huette->huetteID = isset($_GET['id']) ? $_GET['id'] : die();
 
// read the details of huette to be edited
$huette->readOne();
 
// create array
$huette_arr=array(
    "huetteID" => $huette->huetteID,
    "paechtername" => $huette->paechtername,
    "name" => $huette->name,
    "adresse" => $huette->adresse,
    "plz" => $huette->plz,
    "ort" => $huette->ort,
    "plaetze" => $huette->plaetze,
    "telefonnummer" => $huette->telefonnummer,
    "mail" => $huette->mail,
    "website" => $huette->website,
    "IBAN" => $huette->IBAN,
    "BIC" => $huette->BIC,
    "kontoinhaber" => $huette->kontoinhaber,
    "imageurl" => $huette->imageurl,
    "logourl" => $huette->logourl,
    "fruehstueckspreis" => $huette->fruehstueckspreis,
    "halbpensionspreis" => $huette->halbpensionspreis
);
 
// make it json format
print_r(json_encode($huette_arr));
?>