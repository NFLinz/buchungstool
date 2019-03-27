<?php
class Paechter {
 
    // database connection and table name
    private $conn;
    private $table_name = "paechter";
 
    // object properties
    public $paechterID;
    public $huetteID;
    public $mail;
    public $telefonnummer;
    public $vorname;
    public $nachname;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // read products
    function read() {
     
        // select all query
        $query = "SELECT * FROM ".$this->table_name." ";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }

    // used when filling up the update product form
    function readOne(){
     
        // query to read single record
        $query = $query = "SELECT * FROM " . $this->table_name . " p
                    WHERE p.paechterID = ?
                    LIMIT 0,1";
     
        // prepare query statement
        $stmt = $this->conn->prepare( $query );
     
        // bind id of product to be updated
        $stmt->bindParam(1, $this->paechterID);
     
        // execute query
        $stmt->execute();
     
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
     
        // set values to object properties
        $this->paechterID = $row['paechterID'];
        $this->huetteID = $row['huetteID'];
        $this->mail = $row['mail'];
        $this->telefonnummer = $row['telefonnummer'];
        $this->vorname = $row['vorname'];
        $this->nachname = $row['nachname'];
    }

}
?>