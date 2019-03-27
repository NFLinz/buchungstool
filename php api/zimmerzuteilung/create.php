<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 
// get database connection
include_once '../config/database.php';
 
// instantiate
include_once '../objects/zimmerzuteilung.php';

$database = new Database();
$db = $database->getConnection();

$zimmerzuteilung = new Zimmerzuteilung($db);
 
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // get posted data
    $data = json_decode(file_get_contents("php://input"));
    
    // set property values
    $zimmerzuteilung->buchungID = $data->buchungID;
    $zimmerzuteilung->zimmerID = $data->zimmerID;

    // create the buchung
    if($zimmerzuteilung->create()){
        // create array
        $object_arr=array(
            "buchungID" => $zimmerzuteilung->buchungID,
            "zimmerID" => $zimmerzuteilung->zimmerID
        );
        
        // make it json format
        print_r(json_encode($object_arr));
    }
    
    // if unable to create, tell the user
    else{
        echo '{';
            echo '"message": "Unable to create object."';
        echo '}';
    }
}
?>