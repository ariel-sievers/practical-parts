import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!-- header -->
    <app-header></app-header>

    <app-breadcrumb></app-breadcrumb>

    <!-- routes will be rendered here -->
    <router-outlet></router-outlet>

    <!-- footer -->
    <app-footer></app-footer>
  `,
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'Practical Parts';
}
