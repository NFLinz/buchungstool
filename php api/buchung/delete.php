<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
 
// include database and object file
include_once '../config/database.php';
include_once '../objects/buchung.php';
 
// get database connection
$database = new Database();
$db = $database->getConnection();
 
// prepare object
$object = new Buchung($db);
 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // get object id
    $data = json_decode(file_get_contents("php://input"));
    
    // set object id to be deleted
    $object->buchungID = $data->buchungID;
    
    // delete the object
    if($object->delete()){
        echo '{';
            echo '"message": "object was deleted."';
        echo '}';
    }
    
    // if unable to delete the object
    else{
        echo '{';
            echo '"message": "Unable to delete object."';
        echo '}';
    }
}
?>