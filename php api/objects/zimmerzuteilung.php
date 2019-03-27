<?php
class Zimmerzuteilung {
 
    // database connection and table name
    private $conn;
    private $table_name = "zimmerzuteilung";
 
    // object properties
    public $zimmerzuteilungID;
    public $buchungID;
    public $zimmerID;

    // additional:
    public $huetteID;
    public $bookingMonth;
    public $bookingYear;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create new entry
    function create(){
     
        // query to insert record
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    buchungID=:buchungID, zimmerID=:zimmerID
                    ";
     
        // prepare query
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->buchungID=htmlspecialchars(strip_tags($this->buchungID));
        $this->zimmerID=htmlspecialchars(strip_tags($this->zimmerID));
     
        // bind values
        $stmt->bindParam(":buchungID", $this->buchungID);
        $stmt->bindParam(":zimmerID", $this->zimmerID);    

        // execute query
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }


    function readAllAssignmentsForEstablishment() {
        $query =    "SELECT * FROM zimmerzuteilung z
                    WHERE z.buchungID IN 
                    (SELECT b.buchungID FROM buchung b WHERE b.huetteID = ? AND
                        (MONTH(b.checkinDatum)=? OR MONTH(b.checkoutDatum)=?) AND 
                        (YEAR(b.checkinDatum)=? OR YEAR(b.checkoutDatum)=?))
        ";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // bind id of product to be updated
        $stmt->bindParam(1, $this->huetteID);
        $stmt->bindParam(2, $this->bookingMonth);
        $stmt->bindParam(3, $this->bookingMonth);
        $stmt->bindParam(4, $this->bookingYear);
        $stmt->bindParam(5, $this->bookingYear);

        // execute query
        $stmt->execute();
     
        return $stmt;
    }


    function readZimmerForBooking() {
        $query = "SELECT * FROM zimmerzuteilung z
                    WHERE z.buchungID = ?";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // bind id of product to be updated
        $stmt->bindParam(1, $this->buchungID);

        // execute query
        $stmt->execute();
     
        return $stmt;
    }

    function returnFirstZimmerIDForBooking() {
        $query = "SELECT z.zimmerID FROM zimmerzuteilung z
                    WHERE z.buchungID = ?
                    LIMIT 0,1";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // bind id of product to be updated
        $stmt->bindParam(1, $this->buchungID);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
     
        // set values to object properties
        return $row['zimmerID'];
    }

}
?>