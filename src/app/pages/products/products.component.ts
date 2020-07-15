import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {
  resetButton:     any;
  magnifyingGlass: any;
  cancelButton:    any;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.resetButton     = this.el.nativeElement.querySelector('.reset-btn');
    this.magnifyingGlass = this.resetButton.querySelector('.magnifying-glass');
    this.cancelButton    = this.resetButton.querySelector('.cancel');

    // remove animation on click of search bar's reset button
    this.resetButton.removeAllListeners('click');

    // add event listeners so that reset button animation occurs on input focus
    const searchInput    = this.el.nativeElement.querySelector('app-search-bar input');
    this.renderer.listen(searchInput, 'focus', ($event: any) => this.showCancelButton());
    this.renderer.listen(searchInput, 'blur', ($event: any) => this.showMagnifyingGlass());
    
  }

  /**
   * Transition reset button from a magnifying glass to an 'X'.
   * Also ensure the cursor is changed to pointer.
   */
  showCancelButton() {
    this.renderer.addClass(this.magnifyingGlass, 'cancel-btn-1');
    this.renderer.addClass(this.cancelButton, 'cancel-btn-2');
    this.renderer.setStyle(this.resetButton, 'cursor', 'pointer');
  }

  /**
   * Transition reset button from 'X' to a magnifying glass.
   * Also change cursor to default.
   */
  showMagnifyingGlass() {
    this.renderer.removeClass(this.magnifyingGlass, 'cancel-btn-1');
    this.renderer.removeClass(this.cancelButton, 'cancel-btn-2');
    this.renderer.setStyle(this.resetButton, 'cursor', 'default');
  }

}
