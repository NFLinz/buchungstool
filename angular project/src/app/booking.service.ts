import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Buchung } from './buchung';
import { Rechnung } from './rechnung';
import { AppConstants } from './app-constants';
import { Zimmerzuteilung } from './zimmerzuteilung';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

    baseURL: string;

	// We need Http to talk to a remote server.
    constructor(private _http : Http){ 
        this.baseURL = AppConstants.baseURL;
    }


    readBookings() : Observable<Buchung[]> {
        return this._http
            .get(this.baseURL + "/buchung/read.php")
            .pipe(
                map(res => res.json())
            );
    }

    readBookingsByDate(_huetteID: number, _month: number, _year: number) {
        return this._http
            .get(this.baseURL + "/buchung/read_month.php?huetteID=" + _huetteID + "&year="+_year+"&month="+_month)
            .pipe(
                map(res => res.json())
            );
    }

    readOneBooking(id: number): Observable<Buchung>{
        return this._http
            .get(this.baseURL + "/buchung/read_one.php?id="+id)
            .pipe(
                map(res => res.json())
            );
    }

    getAllRoomAssignmentsForEstablishment(_huetteID: number, _month: number, _year: number): Observable<Zimmerzuteilung> {
        return this._http
            .get(this.baseURL + "/zimmerzuteilung/read_all.php?huetteid=" + _huetteID + "&year="+_year+"&month="+_month)
            .pipe(
                map(res => res.json())
            );
    }

    getRoomsForBooking(_bookingID: number): Observable<Zimmerzuteilung> {
        return this._http
            .get(this.baseURL + "/zimmerzuteilung/read_zimmer.php?id=" + _bookingID)
            .pipe(
                map(res => res.json())
            );
    }

  	// Send data to remote server to create it.
    createBooking(_booking): Observable<Buchung>{
        console.log("bookingservice, booking:")
        console.log(_booking)
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        // let newBooking = new Buchung();
        // newBooking.zimmerID = 1;
        // newBooking.checkinDatum = _closedDayForm.get('checkinDatum').value;
 
        return this._http.post(
            this.baseURL + "/buchung/create.php",
            _booking,
            options
        ).pipe(
            map(res => res.json())
        );
    }

    updateBooking(_booking): Observable<Buchung>{
        console.log(_booking)
        
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
     
        return this._http.post(
            this.baseURL + "/buchung/update.php",
            _booking,
            options
        ).pipe(
            map(res => res.json())
        );
    }

    deleteBooking(_id): Observable<Buchung>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let tempBooking = new Buchung();
        tempBooking.buchungID = _id;

        return this._http.post(
            this.baseURL + "/buchung/delete.php",
            tempBooking,
            options
        ).pipe(
            map(res => res.json())
        );
    }

    sendPaymentRequest(_formData) {
        // console.log("SENDPAYMENTREQUEST")
        // console.log("form data for payment") 
        // console.log(_formData)
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
    
        return this._http.post(
            this.baseURL + "/buchung/send_payment_request.php",
            _formData,
            options
        ).pipe(
            map(res => res.json())
        );
    
    }

    confirmBooking(_booking) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
    
        return this._http.post(
            this.baseURL + "/buchung/confirm.php",
            _booking,
            options
        ).pipe(
            map(res => res.json())
        );
    
    }

    setBookingAsPaid(_booking) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
    
        return this._http.post(
            this.baseURL + "/buchung/set_paid.php",
            _booking,
            options
        ).pipe(
            map(res => res.json())
        );
    
    }

    getInvoiceForBooking(_id: number): Observable<Rechnung>{
        return this._http
            .get(this.baseURL + "/buchung/get_invoice.php?bookingid="+_id)
            .pipe(
                map(res => res.json())
            );
    }

    createInvoiceForBooking(_data: Rechnung): Observable<Rechnung>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
    
        return this._http.post(
            this.baseURL + "/rechnung/create.php",
            _data,
            options
        ).pipe(
            map(res => res.json())
        );
    }

    sendInvoiceForBooking(_invoice: Rechnung): Observable<Rechnung>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
    
        return this._http.post(
            this.baseURL + "/rechnung/send.php",
            _invoice,
            options
        ).pipe(
            map(res => res.json())
        );
    }

}
