import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Mitreisender } from './mitreisender';
import { AppConstants } from './app-constants';

@Injectable({
  providedIn: 'root'
})
export class MitreisenderService {

  baseURL: string;

	// We need Http to talk to a remote server.
  constructor(private http : Http){ 
      this.baseURL = AppConstants.baseURL;
  }


  readMitreisendeForBooking(_buchungID: number) : Observable<Mitreisender[]> {
      return this.http
          .get(this.baseURL + "/mitreisender/read_for_booking.php?id=" + _buchungID)
          .pipe(
              map(res => res.json())
          );
  }

  // Send product data to remote server to create it.
  createMitreisender(_mitreisender): Observable<Mitreisender>{
    console.log(_mitreisender)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(
        this.baseURL + "/mitreisender/create.php",
        _mitreisender,
        options
    ).pipe(
        map(res => res.json())
    );
  }

  
}
