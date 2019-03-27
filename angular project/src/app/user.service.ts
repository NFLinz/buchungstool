import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { User } from './user';
import { Buchung } from './buchung';
import { AppConstants } from './app-constants';


@Injectable({
  providedIn: 'root'
})
export class UserService {
    baseURL: string;
    booking: FormGroup;
    user: User;
	// We need Http to talk to a remote server.
    constructor(
        private _http : Http,
        formBuilder: FormBuilder
    ){  
        this.baseURL = AppConstants.baseURL;
    }


    storeBooking(_booking: FormGroup) {
        this.booking = _booking;
    }

  	// Send product data to remote server to create it.
    createUser(_user): Observable<number>{
        console.log(_user)
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this._http.post(
            this.baseURL + "/user/create.php",
            _user,
            options
        ).pipe(
            map(res => res.json())
        );
    }

    // Send product data to remote server to create it.
    createBooking(_user: number): Observable<Buchung>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let newBooking = new Buchung();
        newBooking = this.booking.value;

        return this._http.post(
            this.baseURL + "/buchung/create.php",
            newBooking,
            options
        ).pipe(
            map(res => res.json())
        );
    }

}
