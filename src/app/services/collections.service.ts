import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, publishReplay, refCount, catchError } from 'rxjs/operators';

export interface Collection {
  id:          number,
  title:       string,
  handle:      string,
  description: string,
  image:       {},
  publishedAt: string
}


@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  readonly url = '/.netlify/functions/collections';

  customCollections: Observable<Collection[]>;
  smartCollections:  Observable<Collection[]>;

  constructor(private http: HttpClient) { }

  /**
   * Return an observable of a list of custom collections for the store.
   */
  getCustomCollections(): Observable<Collection[]> {
    if (!this.customCollections) {
      this.customCollections = this.http.get(`${this.url}?type=custom`)
      .pipe(
          map( data => {
            const desiredCollections: Collection[] = [];
            const collections                      = data['custom_collections'];
            for (const collection of collections) {
              const id              = collection['id'];
              const title           = collection['title'];
              const handle          = collection['handle'];
              const description     = collection['body_html'];
              const image           = collection['image'];
              const publishedAt     = collection['published_at'];

              const newCollection   = { id, title, handle, description, image, publishedAt };
              desiredCollections.push(newCollection);
            }
            return desiredCollections;
          }),
          publishReplay(1), 
          refCount(),
          catchError(e => {
            return of(null);
          })
      )
    }
    return this.customCollections;
  }

  /**
   * Return an observable of a list of smart collections for the store.
   */
  getSmartCollections(): Observable<Collection[]> {
    if (!this.smartCollections) {
      this.smartCollections = this.http.get(`${this.url}?type=smart`)
      .pipe(
          map( data => {
            const desiredCollections: Collection[] = [];
            const collections                      = data['smart_collections'];
            for (const collection of collections) {
              const id              = collection['id'];
              const title           = collection['title'];
              const handle          = collection['handle'];
              const description     = collection['body_html'];
              const image           = collection['image'];
              const publishedAt     = collection['published_at'];

              const newCollection   = { id, title, handle, description, image, publishedAt };
              desiredCollections.push(newCollection);
            }
            return desiredCollections;
          }),
          publishReplay(1), 
          refCount(),     
          catchError(e => {
            return of(null);
          })
      )
    }
    return this.smartCollections;
  }

  getCollectionById(id: number) {
    return this.http.get(`${this.url}?id=${id}`)
    .pipe(
        map( data => {
          const collection = data['collection'];

          const id              = collection['id'];
          const title           = collection['title'];
          const handle          = collection['handle'];
          const description     = collection['body_html'];
          const image           = collection['image'];
          const publishedAt     = collection['published_at'];

          const newCollection   = { id, title, handle, description, image, publishedAt };
          return newCollection;
        }),
        catchError(e => {
          return of(null);
        })
      );
  }

  /**
  * Clear caches containing collection information.
  */
  clearCache() {
    this.customCollections = null;
    this.smartCollections  = null;
  }
}
