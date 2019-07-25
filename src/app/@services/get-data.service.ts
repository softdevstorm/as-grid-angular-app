import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders  } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class DataService {
    constructor(private http: HttpClient) { }
    public getData(): Observable<any> {
        return this.http.get("https://www.googleapis.com/youtube/v3/search?key=AIzaSyDOfT_BO81aEZScosfTYMruJobmpjqNeEk&maxResults=50&type=video&part=snippet&q=john");
    }
}
