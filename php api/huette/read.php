<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/database.php';
include_once '../objects/huette.php';

// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$huette = new Huette($db);
 
// query products
$stmt = $huette->read();
$num = $stmt->rowCount();

 
// check if more than 0 record found
if($num>0){
 
    // products array
    $huetten_arr=array();
    $huetten_arr["records"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $huette_item=array(
            "huetteID" => $huetteID,
            "paechtername" => $paechtername,
            "name" => $name,
            "adresse" => $adresse,
            "plz" => $plz,
            "ort" => $ort,
            "plaetze" => $plaetze,
            "telefonnummer" => $telefonnummer,
            "mail" => $mail,
            "website" => $website,
            "IBAN" => $IBAN,
            "BIC" => $BIC,
            "kontoinhaber" => $kontoinhaber,
            "imageurl" => $imageurl,
            "logourl" => $logourl,
            "fruehstueckspreis" => $fruehstueckspreis,
            "halbpensionspreis" => $halbpensionspreis
        );
 
        array_push($huetten_arr["records"], $huette_item);
    }
 
    echo json_encode($huetten_arr);
}
 
else{
    echo json_encode(
        array("message" => "Keine Huetten gefunden.")
    );
}
?>