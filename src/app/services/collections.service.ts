import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { HTTP_OPTIONS } from '../../assets/http-options'
import { FormGroup, FormControl } from '@angular/forms';

export interface Collection {
  id:          number,
  title:       string,
  handle:      string,
  description: string,
  image:       {},
  publishedAt: string
}

const httpOptions = HTTP_OPTIONS;

const version           = environment.API_VERSION;
const shop              = 'practical-parts';
const collectionFields  = 'id,title,handle,body_html,image,published_at';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  readonly customUrl = `https://cors-anywhere.herokuapp.com/https://${shop}.myshopify.com/admin/api/${version}/custom_collections.json`;
  readonly smartUrl  =  `https://cors-anywhere.herokuapp.com/https://${shop}.myshopify.com/admin/api/${version}/smart_collections.json`;

  customCollections: Observable<Collection[]>;
  smartCollections:  Observable<Collection[]>;

  constructor(private http: HttpClient) { }

  /**
   * Return an observable of a list of custom collections for the store.
   */
  getCustomCollections(): Observable<Collection[]> {
    if (!this.customCollections) {
      this.customCollections = this.http.get(this.customUrl + `?fields=${collectionFields}`,
        httpOptions).pipe(
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
          refCount()
      )
    }
    return this.customCollections;
  }

  /**
   * Return an observable of a list of smart collections for the store.
   */
  getSmartCollections(): Observable<Collection[]> {
    if (!this.smartCollections) {
      this.smartCollections = this.http.get(this.smartUrl + `?fields=${collectionFields}`,
        httpOptions).pipe(
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
          refCount()
      )
    }
    return this.smartCollections;
  }

  /**
 * Create a form group from a list of collections.
 * @param collections an array of collections to group
 */
  toFormGroup(collections: Collection[]): FormGroup {
    let group: any = {};

    collections.forEach(c => {
      group[c.id] = new FormControl('');
    })

    return new FormGroup(group);
  }

  /**
  * Clear caches containing collection information.
  */
  clearCache() {
    this.customCollections = null;
    this.smartCollections  = null;
  }
}
