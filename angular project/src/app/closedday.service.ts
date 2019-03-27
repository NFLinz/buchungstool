import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConstants } from './app-constants';
import { Closedday } from './closedday';


@Injectable({
  providedIn: 'root'
})
export class CloseddayService {

  baseURL: string;

	// We need Http to talk to a remote server.
  constructor(private _http : Http){ 
      this.baseURL = AppConstants.baseURL;
  }

  readCloseddays(_huetteID: number) : Observable<Closedday[]> {
    return this._http
        .get(this.baseURL + "/sperrtag/read.php?huetteID=" + _huetteID)
        .pipe(
            map(res => res.json())
        );
  }

  readCloseddaysByDate(_huetteID: number, _month: number, _year: number) {
    return this._http
        .get(this.baseURL + "/sperrtag/read_month.php?huetteID=" + _huetteID + "&year="+_year+"&month="+_month)
        .pipe(
            map(res => res.json())
        );
  }

  deleteClosedDay(_id): Observable<Closedday>{
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    let tempDay = new Closedday();
    tempDay.sperrtagID = _id;

    return this._http.post(
        this.baseURL + "/sperrtag/delete.php",
        tempDay,
        options
    ).pipe(
        map(res => res.json())
    );
}

  createClosedDay(_closedDayForm): Observable<Closedday>{
    // console.log(_closedDayForm)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(
        this.baseURL + "/sperrtag/create.php",
        _closedDayForm.value,
        options
    ).pipe(
        map(res => res.json())
    );
  }


}
