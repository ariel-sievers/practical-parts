import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.sass']
})
export class SearchBarComponent implements OnInit {

  inputEl:   any;
  
  isSquare = true;
  isClosed = true;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.inputEl = this.el.nativeElement.querySelector('input');
  }

  expand() {
    this.isSquare = !this.isSquare;
    this.isClosed = !this.isClosed;

    this.inputEl.focus();
  }

}
