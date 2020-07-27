import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.sass']
})
export class TagsListComponent implements OnInit {
  @Input()  tags: string[];
  @Output() removed = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  remove(tag: string) {
    this.removed.emit(tag);
  }

}
