import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.sass']
})
export class TagsListComponent {
  @Input()  tags: string[];
  @Output() removed = new EventEmitter<string>();

  constructor() { }

  /**
   * Send a remove event so that a tag is removed from the list.
   * @param tag content of the tag
   */
  remove(tag: string) {
    this.removed.emit(tag);
  }

}
