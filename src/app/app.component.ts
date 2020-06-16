import { Component, OnInit } from '@angular/core';
import AOS from 'aos';

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
export class AppComponent implements OnInit {
  title = 'Practical Parts';

  ngOnInit(): void {
    AOS.init();
  }
}
