import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {
  show = false;

  constructor() { }

  ngOnInit() {
  }

  showMenu() {
    this.show = !this.show;
  }

  hideMenu() {
    this.show = false;
  }

}
