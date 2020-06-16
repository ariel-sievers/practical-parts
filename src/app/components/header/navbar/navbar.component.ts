import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
})
export class NavbarComponent implements OnInit {

  show = false;
  
  showMenu() {
    this.show = !this.show;
  }

  constructor() { }

  ngOnInit() {
  }

}
