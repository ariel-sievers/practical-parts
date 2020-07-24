import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ProductsService, Product } from 'src/app/services/products.service';
import { CollectionsService, Collection } from 'src/app/services/collections.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {

  // search bar elements
  resetButton:         any;
  magnifyingGlass:     any;
  cancelButton:        any;

  // whether search bar is focused
  focus:               boolean = false;

  // height to store for animating list in 'filters' pane
  priceRangeHeight:    number;
  
  // whether the collection or price filter lists are being shown
  priceRangeOpen:      boolean = false;

  // lists of products and collections within the store
  productsList:            Product[];
  collectionsList:         Collection[];

  // form for the 'filters' pane
  filtersForm:         FormGroup;

  // for checking if products are loading
  isLoading:           BehaviorSubject<boolean>; 


  constructor(private el: ElementRef, private renderer: Renderer2, private fb: FormBuilder,
    public productsService: ProductsService, public collectionsService: CollectionsService,
    public loadingService: LoadingService) { }

  ngOnInit() {
    this.isLoading = this.loadingService.isLoading;

    this.searchBarViewInit();
    this.priceRangesHeightInit();
    
    this.productsList    = this.getAllProducts();
    this.collectionsList = this.getCollections();

    this.filtersForm = this.createFiltersForm();
  }

  get collectionsControls() { return this.filtersForm.get('collections') }
  get priceControls()       { return this.filtersForm.get('priceRanges'); }

  /**
   * Change search bar component's view and functionality.
   */
  searchBarViewInit(): void {
    this.resetButton     = this.el.nativeElement.querySelector('.reset-btn');
    this.magnifyingGlass = this.resetButton.querySelector('.magnifying-glass');
    this.cancelButton    = this.resetButton.querySelector('.cancel');

    // remove animation on click of search bar's reset button
    this.resetButton.removeAllListeners('click');

    // add event listeners so that reset button animation occurs on input focus and click of magnifying glass
    const searchInput    = this.el.nativeElement.querySelector('app-search-bar input');
    this.renderer.listen(this.resetButton, 'click', ($event: any) => this.toggleFocus(searchInput));
    this.renderer.listen(searchInput, 'focus', ($event: any) => this.showCancelButton());
    this.renderer.listen(searchInput, 'blur', ($event: any) => this.showMagnifyingGlass());
    
  }

  /**
   * Toggle focus on an element.
   * @param el element to toggle focus on
   */
  toggleFocus(el: any) {
    if (this.focus) {
      el.blur();
      this.focus = false;
    } else {
      el.focus();
      this.focus = true;
    }
  }

  /**
   * Transition reset button from a magnifying glass to an 'X'.
   * Also ensure the cursor is changed to pointer.
   */
  showCancelButton() {
    this.renderer.addClass(this.magnifyingGlass, 'cancel-btn-1');
    this.renderer.addClass(this.cancelButton, 'cancel-btn-2');
  }

  /**
   * Transition reset button from 'X' to a magnifying glass.
   * Also change cursor to default.
   */
  showMagnifyingGlass() {
    this.renderer.removeClass(this.magnifyingGlass, 'cancel-btn-1');
    this.renderer.removeClass(this.cancelButton, 'cancel-btn-2');
  }

  /**
   * Get the height of the price range list in the filters pane.
   */
  priceRangesHeightInit(): void {
    const priceRangeEl  = this.el.nativeElement.querySelector('#priceRange + .expandable-list');
    this.priceRangeHeight  = priceRangeEl.offsetHeight;
  }

  /**
   * Return a form group for the collections and price filters.
   */
  createFiltersForm(): FormGroup {
    return this.fb.group({
      newOnly:    [''],
      hasPicture: [''],
      collections: this.collectionsService.toFormGroup(this.collectionsList),
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

  /**
   * Toggle expansion of price range list in filter pane.
   */
  expand(): void {
    this.priceRangeOpen = !this.priceRangeOpen;

    const priceRangeEl = this.el.nativeElement.querySelector('#priceRange + .expandable-list');
    if (this.priceRangeOpen) {
      this.renderer.setStyle(priceRangeEl, 'height', `${this.priceRangeHeight}px`);
    } else {
      this.renderer.setStyle(priceRangeEl, 'height', 0);
    }
  }

  /**
   * Get an array of collections, both custom and smart, that are used in the store.
   */
  getCollections(): Collection[] {
    if (this.collectionsList) { return; }

    const desiredCollections: Collection[] = [];

    this.loadingService.start();
    this.collectionsService.getSmartCollections().subscribe(
      data => {
        for (const collection of data) {
          if (collection.publishedAt !== null) {
            desiredCollections.push(collection);
          }
        }
      },
      err => { },
      () => this.loadingService.end()
    );

    this.loadingService.start();
    // collection with id 38583173235 should not be shown since it is the 'home page' collection
     this.collectionsService.getCustomCollections().subscribe(
      data => {
        for (const collection of data) {
          if (collection.publishedAt !== null && collection.id !== 38583173235) {
            desiredCollections.push(collection);
          }
        }
      },
      err => { },
      () => this.loadingService.end()
    );

    return desiredCollections;
  }

  /**
   * Get an array of all products that are currently published in the store.
   */
  getAllProducts(): Product[] {
    const desiredProducts: Product[] = [];

    this.loadingService.start();
    this.productsService.getProducts().subscribe(
      data => {
        for (const product of data) {
          if (product.publishedAt !== null && product.id !== 4516235673709) {
            desiredProducts.push(product);
          }
        }
      },
      err => { },
      () => this.loadingService.end()
    )

    return desiredProducts;
  }

  /**
   * Gets all the products from a particular collection and currently published in the store.
   * @param collectionId id of the collection to get products from
   */
  getProductsByCollection(collectionId: number): Product[] {
    const desiredProducts: Product[] = [];

    this.loadingService.start();
    this.productsService.getProductsByCollection(collectionId).subscribe(
      data => {
        for (const product of data) { 
          if (product.publishedAt !== null && product.id !== 4516235673709) {
            desiredProducts.push(product);
          }
        }
      },
      err => { },
      () => this.loadingService.end()
    );

    return desiredProducts;
  }

  applyFilters() {

  }

}
