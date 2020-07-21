import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ProductsService, Product } from 'src/app/services/products.service';
import { CollectionsService, Collection } from 'src/app/services/collections.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {
  resetButton:     any;
  magnifyingGlass: any;
  cancelButton:    any;

  collectionsHeight:   number;
  priceRangeHeight:    number;

  products:        Product[];
  collections:     Collection[];

  filtersForm:     FormGroup;

  collectionsOpen: boolean;
  priceRangeOpen:  boolean;

  constructor(private el: ElementRef, private renderer: Renderer2, private fb: FormBuilder,
    public productsService: ProductsService, public collectionsService: CollectionsService) { }

  ngOnInit() {
    this.searchBarViewInit();
    this.expandableListHeightsInit();
    
    this.products    = this.getAllProducts();
    this.collections = this.getCollections();

    this.filtersForm = this.createFiltersForm();
  }

  get collectionsControls() { return this.filtersForm.get('collections') }
  get priceControls()       { return this.filtersForm.get('priceRanges'); }


  /**
   * Return a form group for the collections and price filters.
   */
  createFiltersForm(): FormGroup {
    return this.fb.group({
      newOnly:    [''],
      hasPicture: [''],
      collections: this.collectionsService.toFormGroup(this.collections),
      priceRanges: this.fb.group({
        under10:              [''],
        tenTo25:              [''],
        twentyFiveTo50:       [''],
        fiftyTo75:            [''],
        seventyFiveTo100:     [''],
        oneHundredTo150:      [''],
        oneHundredFiftyTo200: [''],
        above200:             ['']
      })
    })
  }

  expandableListHeightsInit() {

    // get their elements
    const collectionsEl = this.el.nativeElement.querySelector('#collections + .expandable-list');
    const priceRangeEl  = this.el.nativeElement.querySelector('#priceRange + .expandable-list');
    
    // get their heights
    this.collectionsHeight = collectionsEl.offsetHeight;
    this.priceRangeHeight  = priceRangeEl.offsetHeight;

    // set heights to 0
    this.renderer.setStyle(collectionsEl, 'height', 0);
    this.renderer.setStyle(priceRangeEl, 'height', 0);

  }

    /**
   * Toggle expansion of an element if id matches 'priceRange' or 'collections'.
   * @param elementId id of element to call expand() on
   */
  expand(elementId: string) {
    if (elementId === 'priceRange') {
      this.priceRangeOpen = !this.priceRangeOpen;

      const priceRangeEl = this.el.nativeElement.querySelector('#priceRange + .expandable-list');
      if (this.priceRangeOpen) {
        this.renderer.setStyle(priceRangeEl, 'height', `${this.priceRangeHeight}px`);
      } else {
        this.renderer.setStyle(priceRangeEl, 'height', 0);
      }

    } else if (elementId === 'collections') {
      this.collectionsOpen = !this.collectionsOpen;

      const collectionsEl = this.el.nativeElement.querySelector('#collections + .expandable-list');
      if (this.collectionsOpen) {
        this.renderer.setStyle(collectionsEl, 'height', `${this.collectionsHeight}px`);
      } else {
        this.renderer.setStyle(collectionsEl, 'height', 0);
      }
    } else {
      console.log(`Element with id ${elementId} cannot be opened.`);
    }
  }

  searchBarViewInit() {
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

  /**
   * Get an array of collections, both custom and smart, that are used in the store.
   */
  getCollections(): Collection[] {
    if (this.collections) { return; }

    const desiredCollections: Collection[] = [];

    this.collectionsService.getSmartCollections().subscribe( data => {
      for (const collection of data) {
        if (collection.publishedAt !== null) {
          desiredCollections.push(collection);
        }
      }
    })

    // collection with id 38583173235 should not be shown since it is the 'home page' collection
    this.collectionsService.getCustomCollections().subscribe( data => {
      for (const collection of data) {
        if (collection.publishedAt !== null && collection.id !== 38583173235) {
          desiredCollections.push(collection);
        }
      }
    })

    return desiredCollections;
  }

  /**
   * Get an array of all products that are currently published in the store.
   */
  getAllProducts(): Product[] {
    const desiredProducts: Product[] = [];

    this.productsService.getProducts().subscribe( data => {
      for (const product of data) {
        if (product.publishedAt !== null && product.id !== 4516235673709) {
          desiredProducts.push(product);
        }
      }
    })

    return desiredProducts;
  }

  /**
   * Gets all the products from a particular collection and currently published in the store.
   * @param collectionId id of the collection to get products from
   */
  getProductsByCollection(collectionId: number): Product[] {
    const desiredProducts: Product[] = [];

    this.productsService.getProductsByCollection(collectionId).subscribe( data => {
      for (const product of data) { 
        if (product.publishedAt !== null && product.id !== 4516235673709) {
          desiredProducts.push(product);
        }
      }
    });

    return desiredProducts;
  }

}
