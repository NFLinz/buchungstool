<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/paechter.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare huette object
$object = new Paechter($db);
 
// set ID property of object to be edited
$object->paechterID = isset($_GET['id']) ? $_GET['id'] : die();
 
// read the details of object to be edited
$object->readOne();
 
// create array
$object_arr=array(
    "paechterID" => $object->paechterID,
    "huetteID" => $object->huetteID,
    "mail" => $object->mail,
    "telefonnummer" => $object->telefonnummer,
    "vorname" => $object->vorname,
    "nachname" => $object->nachname
);
 
// make it json format
print_r(json_encode($object_arr));
?>