import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass']
})
export class SearchBarComponent implements OnInit {
  input = document.getElementById("search");
  button = document.getElementById("reset-btn");
  
  isSquare = true;
  isClosed = true;
  expand() {
    this.isSquare = !this.isSquare;
    this.isClosed = !this.isClosed;
  }

  constructor() { }

  ngOnInit() {
  }

}
