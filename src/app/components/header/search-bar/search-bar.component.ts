import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass']
})
export class SearchBarComponent implements OnInit {
  
  isSquare = true;
  isClosed = true;

  constructor() { }

  ngOnInit() {
  }

  expand() {
    this.isSquare = !this.isSquare;
    this.isClosed = !this.isClosed;
  }

}
