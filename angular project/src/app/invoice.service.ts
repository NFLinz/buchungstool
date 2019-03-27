import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConstants } from './app-constants';
import { Rechnung } from './rechnung';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  baseURL: string;

	// We need Http to talk to a remote server.
  constructor(private http : Http){ 
      this.baseURL = AppConstants.baseURL;
  }

  readInvoices(_huetteID: number) : Observable<Rechnung[]> {
    return this.http
        .get(this.baseURL + "/rechnung/read.php?id=" + _huetteID)
        .pipe(
            map(res => res.json())
        );
  }

  getDownloadURL(_rechnungID: number) : string {
    return this.baseURL + "/rechnung/download.php?id=" + _rechnungID;
  }

  downloadPDF(_rechnungID: number) {
    console.log(_rechnungID)
    return this.http
        .get(this.baseURL + "/rechnung/download.php?id=" + _rechnungID)
        .pipe(
            map(res => res.json())
        );
  }
  
  deleteInvoice(_id): Observable<Rechnung>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let tempInvoice = new Rechnung();
    tempInvoice.rechnungID = _id;

    return this.http.post(
        this.baseURL + "/rechnung/delete.php",
        tempInvoice,
        options
    ).pipe(
        map(res => res.json())
    );
}


}