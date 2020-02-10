import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  condition = false;
  myFunc() {
    this.condition = !this.condition;

  }

  constructor() { }

  ngOnInit() {
  }

}
