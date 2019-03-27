import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { AppConstants } from './app-constants';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {

  baseURL: string;

  constructor(private _http : Http){ 
    this.baseURL = AppConstants.baseURL;
  }

  // Send data to remote server to create it.
  sendEnquiry(_formData, _huetteID: number) {
    //console.log(_formData)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(
        this.baseURL + "/anfrage/send.php?id=" + _huetteID,
        _formData,
        options
    ).pipe(
        map(res => res.json())
    );
  }

}
