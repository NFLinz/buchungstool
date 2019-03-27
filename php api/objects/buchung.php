<?php

include_once 'huette.php';
include_once 'zimmer.php';
include_once 'zimmerzuteilung.php';

class Buchung extends PDO {
 
    // database connection and table name
    private $conn;
    private $table_name = "buchung";
 
    // object properties
    public $buchungID;
    public $huetteID;
    public $anrede;
    public $firmenname;
    public $erwachseneMitglieder;
    public $erwachseneNichtMitglieder;
    public $jugendlicheMitglieder;
    public $jugendlicheNichtMitglieder;
    public $kinderMitglieder;
    public $kinderNichtMitglieder;
    public $checkinDatum;
    public $checkoutDatum;
    public $buchungsDatum;
    public $preis;

    public $freiplaetzeErwMitglied;
    public $freiplaetzeJgdMitglied;
    public $freiplaetzeKindMitglied;
    public $freiplaetzeErwNichtMitglied;
    public $freiplaetzeJgdNichtMitglied;
    public $freiplaetzeKindNichtMitglied;

    public $anzahlung;
    public $preisErwachsene;
    public $preisJugendliche;
    public $preisKinder;
    public $zahlungsDatum;
    public $zahlungsartID;
    public $verpflegung;
    public $bvorname;
    public $bnachname;
    public $bgeburtsdatum;
    public $badresse;
    public $bplz;
    public $bort;
    public $btelefonnummer;
    public $bmail;
    public $bmitglied;
    public $bemerkung;
    public $bestaetigt;
    public $rgversendet;
    public $bezahlt;

    public $db;

    // additional properties for query
    public $bookingMonth;
    public $bookingYear;
    public $zimmer;
 
    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
        $this->db = $db;
    }

    function getUserID() {
        return $this->conn->lastInsertId();
    }

    // read bookings
    function read() {
     
        // select all query
        $query = "SELECT * FROM buchung";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // execute query
        $stmt->execute();
     
        return $stmt;
    }

    
    function readMonth() {
     
        // select all query
        $query = "SELECT * FROM buchung b WHERE 
            b.huetteID = ? AND
            (MONTH(b.checkinDatum)=? OR MONTH(b.checkoutDatum)=?) AND 
            (YEAR(b.checkinDatum)=? OR YEAR(b.checkoutDatum)=?)";
     
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

    // read one specific entry
    function readOne(){
     
        // query to read single record
        $query = $query = "SELECT * FROM " . $this->table_name . " b
                    WHERE b.buchungID = ?
                    LIMIT 0,1";
     
        // prepare query statement
        $stmt = $this->conn->prepare( $query );
     
        // bind id of product to be updated
        $stmt->bindParam(1, $this->buchungID);
     
        // execute query
        $stmt->execute();
     
        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
     
        // set values to object properties
        $this->buchungID = $row['buchungID'];
        $this->huetteID = $row['huetteID'];
        $this->anrede = $row['anrede'];
        $this->firmenname = $row['firmenname'];
        $this->erwachseneMitglieder = $row['erwachseneMitglieder'];
        $this->erwachseneNichtMitglieder = $row['erwachseneNichtMitglieder'];
        $this->jugendlicheMitglieder = $row['jugendlicheMitglieder'];
        $this->jugendlicheNichtMitglieder = $row['jugendlicheNichtMitglieder'];
        $this->kinderMitglieder = $row['kinderMitglieder'];
        $this->kinderNichtMitglieder = $row['kinderNichtMitglieder'];
        $this->checkinDatum = $row['checkinDatum'];
        $this->checkoutDatum = $row['checkoutDatum'];
        $this->buchungsDatum = $row['buchungsDatum'];
        $this->preisErwachsene = $row['preisErwachsene'];
        $this->preisJugendliche = $row['preisJugendliche'];
        $this->preisKinder = $row['preisKinder'];
        $this->preis = $row['preis'];
        $this->freiplaetzeErwMitglied = $row['freiplaetzeErwMitglied'];
        $this->freiplaetzeJgdMitglied = $row['freiplaetzeJgdMitglied'];
        $this->freiplaetzeKindMitglied = $row['freiplaetzeKindMitglied'];
        $this->freiplaetzeErwNichtMitglied = $row['freiplaetzeErwNichtMitglied'];
        $this->freiplaetzeJgdNichtMitglied = $row['freiplaetzeJgdNichtMitglied'];
        $this->freiplaetzeKindNichtMitglied = $row['freiplaetzeKindNichtMitglied'];
        $this->anzahlung = $row['anzahlung'];
        $this->zahlungsDatum = $row['zahlungsDatum'];
        $this->zahlungsartID = $row['zahlungsartID'];
        $this->verpflegung = $row['verpflegung'];
        $this->bvorname = $row['bvorname'];
        $this->bnachname = $row['bnachname'];
        $this->bgeburtsdatum = $row['bgeburtsdatum'];
        $this->badresse = $row['badresse'];
        $this->bplz = $row['bplz'];
        $this->bort = $row['bort'];
        $this->btelefonnummer = $row['btelefonnummer'];
        $this->bmail = $row['bmail'];
        $this->bmitglied = $row['bmitglied'];
        $this->bemerkung = $row['bemerkung'];
        $this->bestaetigt = $row['bestaetigt']; 
        $this->rgversendet = $row['rgversendet'];   
        $this->bezahlt = $row['bezahlt'];    
    }

    // create new entry
    function create(){
        $database = new Database();
        $db = $database->getConnection();

        if (!isset($this->preisErwachsene)) {
            $this->preisErwachsene = $this->zimmer->preisErw;
        }
        if (!isset($this->preisJugendliche)) {
            $this->preisJugendliche = $this->zimmer->preisJgd;
        }
        if (!isset($this->preisKinder)) {
            $this->preisKinder = 0;
        }
     
        // query to insert record
        $query = "INSERT INTO
                    " . $this->table_name . "
                SET
                    huetteID=:huetteID, anrede=:anrede, firmenname=:firmenname,
                    erwachseneMitglieder=:erwachseneMitglieder, erwachseneNichtMitglieder=:erwachseneNichtMitglieder,
                    jugendlicheMitglieder=:jugendlicheMitglieder, jugendlicheNichtMitglieder=:jugendlicheNichtMitglieder,
                    kinderMitglieder=:kinderMitglieder, kinderNichtMitglieder=:kinderNichtMitglieder,
                    checkinDatum=:checkinDatum, checkoutDatum=:checkoutDatum, buchungsDatum=:buchungsDatum, 
                    preis=:preis, anzahlung=:anzahlung, zahlungsDatum=:zahlungsDatum,
                    freiplaetzeErwMitglied=:freiplaetzeErwMitglied, freiplaetzeJgdMitglied=:freiplaetzeJgdMitglied,
                    freiplaetzeKindMitglied=:freiplaetzeKindMitglied, freiplaetzeErwNichtMitglied=:freiplaetzeErwNichtMitglied,
                    freiplaetzeJgdNichtMitglied=:freiplaetzeJgdNichtMitglied, freiplaetzeKindNichtMitglied=:freiplaetzeKindNichtMitglied,
                    preisErwachsene=:preisErwachsene, preisJugendliche=:preisJugendliche, preisKinder=:preisKinder,
                    zahlungsartID=:zahlungsartID, verpflegung=:verpflegung, bvorname=:bvorname, bnachname=:bnachname,
                    bgeburtsdatum=:bgeburtsdatum, badresse=:badresse, bplz=:bplz, bort=:bort, btelefonnummer=:btelefonnummer,
                    bmail=:bmail, bmitglied=:bmitglied, bemerkung=:bemerkung, 
                    bestaetigt=:bestaetigt, rgversendet=:rgversendet, bezahlt=:bezahlt
                    ";
     
        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->huetteID=htmlspecialchars(strip_tags($this->huetteID));
        $this->anrede=htmlspecialchars(strip_tags($this->anrede));
        $this->firmenname=htmlspecialchars(strip_tags($this->firmenname));
        $this->erwachseneMitglieder=htmlspecialchars(strip_tags($this->erwachseneMitglieder));
        $this->erwachseneNichtMitglieder=htmlspecialchars(strip_tags($this->erwachseneNichtMitglieder));
        $this->jugendlicheMitglieder=htmlspecialchars(strip_tags($this->jugendlicheMitglieder));
        $this->jugendlicheNichtMitglieder=htmlspecialchars(strip_tags($this->jugendlicheNichtMitglieder));
        $this->kinderMitglieder=htmlspecialchars(strip_tags($this->kinderMitglieder));
        $this->kinderNichtMitglieder=htmlspecialchars(strip_tags($this->kinderNichtMitglieder));
        $this->checkinDatum=htmlspecialchars(strip_tags($this->checkinDatum));
        $this->checkoutDatum=htmlspecialchars(strip_tags($this->checkoutDatum));
        $this->buchungsDatum=htmlspecialchars(strip_tags($this->buchungsDatum));
        $this->preisErwachsene=htmlspecialchars(strip_tags($this->preisErwachsene));
        $this->preisJugendliche=htmlspecialchars(strip_tags($this->preisJugendliche));
        $this->preisKinder=htmlspecialchars(strip_tags($this->preisKinder));
        $this->preis=htmlspecialchars(strip_tags($this->preis));
        $this->freiplaetzeErwMitglied=htmlspecialchars(strip_tags($this->freiplaetzeErwMitglied));
        $this->freiplaetzeJgdMitglied=htmlspecialchars(strip_tags($this->freiplaetzeJgdMitglied));
        $this->freiplaetzeKindMitglied=htmlspecialchars(strip_tags($this->freiplaetzeKindMitglied));
        $this->freiplaetzeErwNichtMitglied=htmlspecialchars(strip_tags($this->freiplaetzeErwNichtMitglied));
        $this->freiplaetzeJgdNichtMitglied=htmlspecialchars(strip_tags($this->freiplaetzeJgdNichtMitglied));
        $this->freiplaetzeKindNichtMitglied=htmlspecialchars(strip_tags($this->freiplaetzeKindNichtMitglied));
        $this->anzahlung=htmlspecialchars(strip_tags($this->anzahlung));
        $this->zahlungsDatum=htmlspecialchars(strip_tags($this->zahlungsDatum));
        $this->zahlungsartID=htmlspecialchars(strip_tags($this->zahlungsartID));
        $this->verpflegung = htmlspecialchars(strip_tags($this->verpflegung));
        $this->bvorname = htmlspecialchars(strip_tags($this->bvorname));
        $this->bnachname = htmlspecialchars(strip_tags($this->bnachname));
        $this->bgeburtsdatum = htmlspecialchars(strip_tags($this->bgeburtsdatum));
        $this->badresse = htmlspecialchars(strip_tags($this->badresse));
        $this->bplz = htmlspecialchars(strip_tags($this->bplz));
        $this->bort = htmlspecialchars(strip_tags($this->bort));
        $this->btelefonnummer = htmlspecialchars(strip_tags($this->btelefonnummer));
        $this->bmail = htmlspecialchars(strip_tags($this->bmail));
        $this->bmitglied = htmlspecialchars(strip_tags($this->bmitglied));
        $this->bemerkung = htmlspecialchars(strip_tags($this->bemerkung));
        $this->bestaetigt = htmlspecialchars(strip_tags($this->bestaetigt));
        $this->rgversendet = htmlspecialchars(strip_tags($this->rgversendet));
        $this->bezahlt = htmlspecialchars(strip_tags($this->bezahlt));
     
        // bind values
        $stmt->bindParam(":huetteID", $this->huetteID);
        $stmt->bindParam(":anrede", $this->anrede);
        $stmt->bindParam(":firmenname", $this->firmenname);
        $stmt->bindParam(":erwachseneMitglieder", $this->erwachseneMitglieder);
        $stmt->bindParam(":erwachseneNichtMitglieder", $this->erwachseneNichtMitglieder);
        $stmt->bindParam(":jugendlicheMitglieder", $this->jugendlicheMitglieder);
        $stmt->bindParam(":jugendlicheNichtMitglieder", $this->jugendlicheNichtMitglieder);
        $stmt->bindParam(":kinderMitglieder", $this->kinderMitglieder);
        $stmt->bindParam(":kinderNichtMitglieder", $this->kinderNichtMitglieder);
        $stmt->bindParam(":checkinDatum", $this->checkinDatum);
        $stmt->bindParam(":checkoutDatum", $this->checkoutDatum);
        $stmt->bindParam(":buchungsDatum", $this->buchungsDatum);
        $stmt->bindParam(":preisErwachsene", $this->preisErwachsene);
        $stmt->bindParam(":preisJugendliche", $this->preisJugendliche);
        $stmt->bindParam(":preisKinder", $this->preisKinder);
        $stmt->bindParam(":preis", $this->preis);
        $stmt->bindParam(":freiplaetzeErwMitglied", $this->freiplaetzeErwMitglied);
        $stmt->bindParam(":freiplaetzeJgdMitglied", $this->freiplaetzeJgdMitglied);
        $stmt->bindParam(":freiplaetzeKindMitglied", $this->freiplaetzeKindMitglied);
        $stmt->bindParam(":freiplaetzeErwNichtMitglied", $this->freiplaetzeErwNichtMitglied);
        $stmt->bindParam(":freiplaetzeJgdNichtMitglied", $this->freiplaetzeJgdNichtMitglied);
        $stmt->bindParam(":freiplaetzeKindNichtMitglied", $this->freiplaetzeKindNichtMitglied);
        $stmt->bindParam(":anzahlung", $this->anzahlung);
        $stmt->bindParam(":zahlungsDatum", $this->zahlungsDatum);
        $stmt->bindParam(":zahlungsartID", $this->zahlungsartID);
        $stmt->bindParam(":verpflegung", $this->verpflegung);
        $stmt->bindParam(":bvorname", $this->bvorname);
        $stmt->bindParam(":bnachname", $this->bnachname);
        $stmt->bindParam(":bgeburtsdatum", $this->bgeburtsdatum);
        $stmt->bindParam(":badresse", $this->badresse);
        $stmt->bindParam(":bplz", $this->bplz);
        $stmt->bindParam(":bort", $this->bort);
        $stmt->bindParam(":btelefonnummer", $this->btelefonnummer);
        $stmt->bindParam(":bmail", $this->bmail);
        $stmt->bindParam(":bmitglied", $this->bmitglied);
        $stmt->bindParam(":bemerkung", $this->bemerkung);     
        $stmt->bindParam(":bestaetigt", $this->bestaetigt);  
        $stmt->bindParam(":rgversendet", $this->rgversendet);     
        $stmt->bindParam(":bezahlt", $this->bezahlt);     

        // execute query
        if($stmt->execute()){
            $this->buchungID = $this->db->lastInsertId();
            return true;
        }
     
        return false;
    }


    // delete the booking
    function delete(){
     
        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE buchungID = ?";
     
        // prepare query
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->buchungID=htmlspecialchars(strip_tags($this->buchungID));
     
        // bind id of record to delete
        $stmt->bindParam(1, $this->buchungID);
     
        // execute query
        if($stmt->execute()){
            return true;
        }
     
        return false;
         
    }


    function confirm(){

        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    bestaetigt=true
                WHERE
                    buchungID = :buchungID";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->buchungID=htmlspecialchars(strip_tags($this->buchungID));
     
        // bind new values
        $stmt->bindParam(':buchungID', $this->buchungID);
     
        // execute the query
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }

    function setInvoiceAsSent(){

        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    rgversendet=true
                WHERE
                    buchungID = :buchungID";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->buchungID=htmlspecialchars(strip_tags($this->buchungID));
     
        // bind new values
        $stmt->bindParam(':buchungID', $this->buchungID);
     
        // execute the query
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }

    function setAsFullyPaid(){

        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    bezahlt=true
                WHERE
                    buchungID = :buchungID";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->buchungID=htmlspecialchars(strip_tags($this->buchungID));
     
        // bind new values
        $stmt->bindParam(':buchungID', $this->buchungID);
     
        // execute the query
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }

    function getTotalPrice() {
        $database = new Database();
        $db = $database->getConnection();

        // create huette object and fill its parameters
        $huette = new Huette($db);
        $huette->huetteID = $this->huetteID;
        $huette->readOne();

        // get number of nights:
        $date1 = new DateTime($this->checkinDatum);
        $date2 = new DateTime($this->checkoutDatum);
        $numberOfNights= $date2->diff($date1)->format("%a"); 

        // get prices for the stay
        $totalPersons = $this->erwachseneMitglieder + $this->jugendlicheMitglieder + 
                        $this->kinderMitglieder + $this->erwachseneNichtMitglieder + 
                        $this->jugendlicheNichtMitglieder + $this->kinderNichtMitglieder;
        $verpflegungGesamtpreis = 0;
        if (strcmp($this->verpflegung, "Frühstück") === 0) {
            $verpflegungGesamtpreis = $totalPersons * $huette->fruehstueckspreis * $numberOfNights;
        } else {
            $verpflegungGesamtpreis = $totalPersons * $huette->halbpensionspreis * $numberOfNights;
        }

        $memberDiscount = 0.9;

        $erwachseneMitgliedNights = ($this->erwachseneMitglieder - $this->freiplaetzeErwMitglied) * $numberOfNights;
        $erwachseneMitgliedGesamtpreis = $this->preisErwachsene * $erwachseneMitgliedNights * $memberDiscount;

        $jugendlicheMitgliedNights = ($this->jugendlicheMitglieder - $this->freiplaetzeJgdMitglied) * $numberOfNights;
        $jugendlicheMitgliedGesamtpreis = $this->preisJugendliche * $jugendlicheMitgliedNights * $memberDiscount;

        $kinderMitgliedNights = ($this->kinderMitglieder - $this->freiplaetzeKindMitglied) * $numberOfNights;
        $kinderMitgliedGesamtpreis = 0;

        $erwachseneNichtMitgliedNights = ($this->erwachseneNichtMitglieder - $this->freiplaetzeErwNichtMitglied) * $numberOfNights;
        $erwachseneNichtMitgliedGesamtpreis = $this->preisErwachsene * $erwachseneNichtMitgliedNights;

        $jugendlicheNichtMitgliedNights = ($this->jugendlicheNichtMitglieder - $this->freiplaetzeJgdNichtMitglied) * $numberOfNights;
        $jugendlicheNichtMitgliedGesamtpreis = $this->preisJugendliche * $jugendlicheNichtMitgliedNights;

        $kinderNichtMitgliedNights = ($this->kinderNichtMitglieder - $this->freiplaetzeKindNichtMitglied) * $numberOfNights;
        $kinderNichtMitgliedGesamtpreis = 0;

        $total =    $verpflegungGesamtpreis + $erwachseneMitgliedGesamtpreis + 
                    $jugendlicheMitgliedGesamtpreis + $kinderMitgliedGesamtpreis +
                    $erwachseneNichtMitgliedGesamtpreis + $jugendlicheNichtMitgliedGesamtpreis +
                    $kinderNichtMitgliedGesamtpreis;

        return $total;
    }

    function getTotalPriceWithoutReductions() {
        $database = new Database();
        $db = $database->getConnection();

        // create huette object and fill its parameters
        $huette = new Huette($db);
        $huette->huetteID = $this->huetteID;
        $huette->readOne();

        // get one room and fill its parameters
        $zimmerzuteilung = new Zimmerzuteilung($db);
        $zimmerzuteilung->buchungID = $this->buchungID;
        $firstRoomID = $zimmerzuteilung->returnFirstZimmerIDForBooking();

        $zimmer = new Zimmer($db);
        $zimmer->zimmerID = $firstRoomID;
        $zimmer->readOne();

        // get number of nights:
        $date1 = new DateTime($this->checkinDatum);
        $date2 = new DateTime($this->checkoutDatum);
        $numberOfNights= $date2->diff($date1)->format("%a"); 

        // invoice date format:
        // $this->datum = date_create($this->datum);

        // get prices for the stay
        $totalPersons = $this->erwachseneMitglieder + $this->jugendlicheMitglieder + 
                        $this->kinderMitglieder + $this->erwachseneNichtMitglieder + 
                        $this->jugendlicheNichtMitglieder + $this->kinderNichtMitglieder;
        $verpflegungGesamtpreis = 0;
        if (strcmp($this->verpflegung, "Frühstück") === 0) {
            $verpflegungGesamtpreis = $totalPersons * $huette->fruehstueckspreis * $numberOfNights;
        } else {
            $verpflegungGesamtpreis = $totalPersons * $huette->halbpensionspreis * $numberOfNights;
        }

        $memberDiscount = 0.9;

        $erwachseneMitgliedNights = $this->erwachseneMitglieder * $numberOfNights;
        $erwachseneMitgliedGesamtpreis = $zimmer->preisErw * $erwachseneMitgliedNights * $memberDiscount;

        $jugendlicheMitgliedNights = $this->jugendlicheMitglieder * $numberOfNights;
        $jugendlicheMitgliedGesamtpreis = $zimmer->preisJgd * $jugendlicheMitgliedNights * $memberDiscount;

        $kinderMitgliedNights = $this->kinderMitglieder * $numberOfNights;
        $kinderMitgliedGesamtpreis = 0;

        $erwachseneNichtMitgliedNights = $this->erwachseneNichtMitglieder * $numberOfNights;
        $erwachseneNichtMitgliedGesamtpreis = $zimmer->preisErw * $erwachseneNichtMitgliedNights;

        $jugendlicheNichtMitgliedNights = $this->jugendlicheNichtMitglieder * $numberOfNights;
        $jugendlicheNichtMitgliedGesamtpreis = $zimmer->preisJgd * $jugendlicheNichtMitgliedNights;

        $kinderNichtMitgliedNights = $this->kinderNichtMitglieder * $numberOfNights;
        $kinderNichtMitgliedGesamtpreis = 0;

        $total =    $verpflegungGesamtpreis + $erwachseneMitgliedGesamtpreis + 
                    $jugendlicheMitgliedGesamtpreis + $kinderMitgliedGesamtpreis +
                    $erwachseneNichtMitgliedGesamtpreis + $jugendlicheNichtMitgliedGesamtpreis +
                    $kinderNichtMitgliedGesamtpreis;

        return $total;
    }

    // update
    function update(){   
        $this->preis = $this->getTotalPrice();

        // update query
        $query = "UPDATE
                    " . $this->table_name . "
                SET
                    anrede=:anrede, firmenname=:firmenname,
                    erwachseneMitglieder=:erwachseneMitglieder, erwachseneNichtMitglieder=:erwachseneNichtMitglieder,
                    jugendlicheMitglieder=:jugendlicheMitglieder, jugendlicheNichtMitglieder=:jugendlicheNichtMitglieder,
                    kinderMitglieder=:kinderMitglieder, kinderNichtMitglieder=:kinderNichtMitglieder,
                    checkinDatum=:checkinDatum, checkoutDatum=:checkoutDatum,
                    freiplaetzeErwMitglied=:freiplaetzeErwMitglied, freiplaetzeJgdMitglied=:freiplaetzeJgdMitglied,
                    freiplaetzeKindMitglied=:freiplaetzeKindMitglied, freiplaetzeErwNichtMitglied=:freiplaetzeErwNichtMitglied,
                    freiplaetzeJgdNichtMitglied=:freiplaetzeJgdNichtMitglied, freiplaetzeKindNichtMitglied=:freiplaetzeKindNichtMitglied,
                    preisErwachsene=:preisErwachsene, preisJugendliche=:preisJugendliche, preisKinder=:preisKinder,
                    preis=:preis, verpflegung=:verpflegung, 
                    bvorname=:bvorname, bnachname=:bnachname,
                    bgeburtsdatum=:bgeburtsdatum, badresse=:badresse, bplz=:bplz, bort=:bort, 
                    btelefonnummer=:btelefonnummer,
                    bmail=:bmail, bemerkung=:bemerkung,
                    bestaetigt=:bestaetigt, rgversendet=:rgversendet, bezahlt=:bezahlt
                WHERE
                    buchungID = :buchungID";
     
        // prepare query statement
        $stmt = $this->conn->prepare($query);
     
        // sanitize
        $this->buchungID=htmlspecialchars(strip_tags($this->buchungID));
        $this->anrede=htmlspecialchars(strip_tags($this->anrede));
        $this->firmenname=htmlspecialchars(strip_tags($this->firmenname));
        $this->erwachseneMitglieder=htmlspecialchars(strip_tags($this->erwachseneMitglieder));
        $this->erwachseneNichtMitglieder=htmlspecialchars(strip_tags($this->erwachseneNichtMitglieder));
        $this->jugendlicheMitglieder=htmlspecialchars(strip_tags($this->jugendlicheMitglieder));
        $this->jugendlicheNichtMitglieder=htmlspecialchars(strip_tags($this->jugendlicheNichtMitglieder));
        $this->kinderMitglieder=htmlspecialchars(strip_tags($this->kinderMitglieder));
        $this->kinderNichtMitglieder=htmlspecialchars(strip_tags($this->kinderNichtMitglieder));
        $this->checkinDatum=htmlspecialchars(strip_tags($this->checkinDatum));
        $this->checkoutDatum=htmlspecialchars(strip_tags($this->checkoutDatum));
        $this->preis=htmlspecialchars(strip_tags($this->preis));
        $this->freiplaetzeErwMitglied=htmlspecialchars(strip_tags($this->freiplaetzeErwMitglied));
        $this->freiplaetzeJgdMitglied=htmlspecialchars(strip_tags($this->freiplaetzeJgdMitglied));
        $this->freiplaetzeKindMitglied=htmlspecialchars(strip_tags($this->freiplaetzeKindMitglied));
        $this->freiplaetzeErwNichtMitglied=htmlspecialchars(strip_tags($this->freiplaetzeErwNichtMitglied));
        $this->freiplaetzeJgdNichtMitglied=htmlspecialchars(strip_tags($this->freiplaetzeJgdNichtMitglied));
        $this->freiplaetzeKindNichtMitglied=htmlspecialchars(strip_tags($this->freiplaetzeKindNichtMitglied));
        $this->preisErwachsene=htmlspecialchars(strip_tags($this->preisErwachsene));
        $this->preisJugendliche=htmlspecialchars(strip_tags($this->preisJugendliche));
        $this->preisKinder=htmlspecialchars(strip_tags($this->preisKinder));
        $this->verpflegung = htmlspecialchars(strip_tags($this->verpflegung));
        $this->bvorname = htmlspecialchars(strip_tags($this->bvorname));
        $this->bnachname = htmlspecialchars(strip_tags($this->bnachname));
        $this->bgeburtsdatum = htmlspecialchars(strip_tags($this->bgeburtsdatum));
        $this->badresse = htmlspecialchars(strip_tags($this->badresse));
        $this->bplz = htmlspecialchars(strip_tags($this->bplz));
        $this->bort = htmlspecialchars(strip_tags($this->bort));
        $this->btelefonnummer = htmlspecialchars(strip_tags($this->btelefonnummer));
        $this->bmail = htmlspecialchars(strip_tags($this->bmail));
        $this->bemerkung = htmlspecialchars(strip_tags($this->bemerkung));
        $this->bestaetigt = htmlspecialchars(strip_tags($this->bestaetigt));
        $this->rgversendet = htmlspecialchars(strip_tags($this->rgversendet));
        $this->bezahlt = htmlspecialchars(strip_tags($this->bezahlt));
     
        // bind new values
        $stmt->bindParam(':buchungID', $this->buchungID);
        $stmt->bindParam(":anrede", $this->anrede);
        $stmt->bindParam(":firmenname", $this->firmenname);
        $stmt->bindParam(":erwachseneMitglieder", $this->erwachseneMitglieder);
        $stmt->bindParam(":erwachseneNichtMitglieder", $this->erwachseneNichtMitglieder);
        $stmt->bindParam(":jugendlicheMitglieder", $this->jugendlicheMitglieder);
        $stmt->bindParam(":jugendlicheNichtMitglieder", $this->jugendlicheNichtMitglieder);
        $stmt->bindParam(":kinderMitglieder", $this->kinderMitglieder);
        $stmt->bindParam(":kinderNichtMitglieder", $this->kinderNichtMitglieder);
        $stmt->bindParam(":checkinDatum", $this->checkinDatum);
        $stmt->bindParam(":checkoutDatum", $this->checkoutDatum);
        $stmt->bindParam(":preis", $this->preis);
        $stmt->bindParam(":freiplaetzeErwMitglied", $this->freiplaetzeErwMitglied);
        $stmt->bindParam(":freiplaetzeJgdMitglied", $this->freiplaetzeJgdMitglied);
        $stmt->bindParam(":freiplaetzeKindMitglied", $this->freiplaetzeKindMitglied);
        $stmt->bindParam(":freiplaetzeErwNichtMitglied", $this->freiplaetzeErwNichtMitglied);
        $stmt->bindParam(":freiplaetzeJgdNichtMitglied", $this->freiplaetzeJgdNichtMitglied);
        $stmt->bindParam(":freiplaetzeKindNichtMitglied", $this->freiplaetzeKindNichtMitglied);
        $stmt->bindParam(":preisErwachsene", $this->preisErwachsene);
        $stmt->bindParam(":preisJugendliche", $this->preisJugendliche);
        $stmt->bindParam(":preisKinder", $this->preisKinder);
        $stmt->bindParam(":verpflegung", $this->verpflegung);
        $stmt->bindParam(":bvorname", $this->bvorname);
        $stmt->bindParam(":bnachname", $this->bnachname);
        $stmt->bindParam(":bgeburtsdatum", $this->bgeburtsdatum);
        $stmt->bindParam(":badresse", $this->badresse);
        $stmt->bindParam(":bplz", $this->bplz);
        $stmt->bindParam(":bort", $this->bort);
        $stmt->bindParam(":btelefonnummer", $this->btelefonnummer);
        $stmt->bindParam(":bmail", $this->bmail);
        $stmt->bindParam(":bemerkung", $this->bemerkung);     
        $stmt->bindParam(":bestaetigt", $this->bestaetigt);     
        $stmt->bindParam(":rgversendet", $this->rgversendet);     
        $stmt->bindParam(":bezahlt", $this->bezahlt);     

        // execute the query
        if($stmt->execute()){
            return true;
        }
     
        return false;
    }

}
?>