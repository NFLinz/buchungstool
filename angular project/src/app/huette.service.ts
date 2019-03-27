import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Huette } from './huette';
import { Zimmer } from './zimmer';
import { Zimmerkategorie } from './zimmerkategorie';
import { Observable, of } from 'rxjs';
import { AppConstants } from './app-constants';


@Injectable({
  providedIn: 'root'
})
export class HuetteService {

    baseURL: string;

	 // We need Http to talk to a remote server.
    constructor(private _http : Http){ 
        this.baseURL = AppConstants.baseURL;
    }
 
    readHuetten(): Observable<Huette[]>{
        return this._http
            .get(this.baseURL + "/huette/read.php")
            .pipe(
            	map(res => res.json())
            );
    }
 
    readOneHuette(id: number): Observable<Huette>{
        return this._http
            .get(this.baseURL + "/huette/read_one.php?id="+id)
            .pipe(
                map(res => res.json())
            );
    }

    readZimmer(_huetteID: number): Observable<Zimmer[]>{
        return this._http
            .get(this.baseURL + "/huette/read_zimmer.php?id="+_huetteID)
            .pipe(
                map(res => res.json())
            );
    }

    readCategories(_huetteID: number): Observable<Zimmerkategorie[]> {
        return this._http
            .get(this.baseURL + "/huette/read_zimmerkategorien.php?id="+_huetteID)
            .pipe(
                map(res => res.json())
            );
    }

    // get all rooms of the specified category
    readZimmerWithCategory(_huetteID: number, _kategorieID: number) : Observable<Zimmer[]> {
        return this._http
            .get(this.baseURL + "/huette/read_all_of_category.php?id="+_huetteID+"&cat="+_kategorieID)
            .pipe(
                map(res => res.json())
            );
    }
}