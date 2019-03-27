import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Zimmer } from './zimmer';
import { Zimmerkategorie } from './zimmerkategorie';
import { AppConstants } from './app-constants';


@Injectable({
  providedIn: 'root'
})
export class ZimmerService {

    baseURL: string;

   constructor(private _http : Http){ 
       this.baseURL = AppConstants.baseURL;
   }


    readZimmer() : Observable<Zimmer[]> {
        return this._http
            .get(this.baseURL + "/zimmer/read.php")
            .pipe(
                map(res => res.json())
            );
    }

    readZimmerForHuette(_huetteID: number) : Observable<Zimmer[]> {
        return this._http
            .get(this.baseURL + "/zimmer/read_for_huette.php?huetteID=" + _huetteID)
            .pipe(
                map(res => res.json())
            );
    }


    // Get details for one specific room
    readOneZimmer(_id: number): Observable<Zimmer>{
        return this._http
            .get(this.baseURL + "/zimmer/read_one.php?id="+_id)
            .pipe(
                map(res => res.json())
            );
    }

}
