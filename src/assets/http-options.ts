import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

export const HTTP_OPTIONS = {
    headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': `Basic ${environment.BASE_64_STRING}` 
    })
};