import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ProductsService, Product, Variant } from 'src/app/services/products.service';
import { CollectionsService, Collection } from 'src/app/services/collections.service';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { BehaviorSubject } from 'rxjs';
import { Filter, isFilter, findFilterByName, getFilterNames } from 'src/app/filter';
import { uniqBy } from 'lodash';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.sass']
})
export class ProductsComponent implements OnInit {

  // search bar elements
  resetButton:           any;
  magnifyingGlass:       any;
  cancelButton:          any;

  // whether search bar is focused
  focus:                 boolean = false;

  // height to store for animating list in 'filters' pane
  priceRangeHeight:      number;
  
  // whether the collection or price filter lists are being shown
  priceRangeOpen:        boolean = false;

  // lists of products and collections within the store
  productsList:          Product[];
  collectionsList:       Collection[];

  // filters related variables
  filtersForm:           FormGroup;
  filters:               Filter[];

  // for checking if products are loading
  isLoading:             BehaviorSubject<boolean>; 


  constructor(private el: ElementRef, private renderer: Renderer2, private fb: FormBuilder,
    public productsService: ProductsService, public collectionsService: CollectionsService,
    public loadingService: LoadingService) { }

  ngOnInit() {
    this.isLoading             = this.loadingService.isLoading;

    this.searchBarViewInit();
    this.priceRangesHeightInit();
    
    this.productsList          = this.getAllProducts();
    this.collectionsList       = this.getCollections();

    this.filtersForm           = this.createFiltersForm();
    this.filters               = [];
  }

  get newOnlyControl()      { return this.filtersForm.get('newOnly') }
  get hasPictureControl()   { return this.filtersForm.get('hasPicture'); }
  get collectionsControl()  { return this.filtersForm.get('collections'); }
  get priceControls()       { return this.filtersForm.get('priceRanges') as FormGroup; }

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
   * Toggle the radio button if it's id (which is equal to its value) is the same
   * as the current form control's value.
   * @param e click event on a radio button
   */
  toggleRadio(e: any) {
    if (this.collectionsControl.value === e.target.id) {
      this.collectionsControl.setValue('');
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
    this.renderer.setStyle(priceRangeEl, 'height', 0);
  }

  /**
   * Return a form group for the collections and price filters.
   */
  createFiltersForm(): FormGroup {
    return this.fb.group({
      newOnly:     [false],
      hasPicture:  [false],
      collections: [''],
      priceRanges: this.fb.group({
        under10:              [false],
        tenTo25:              [false],
        twentyFiveTo50:       [false],
        fiftyTo75:            [false],
        seventyFiveTo100:     [false],
        oneHundredTo150:      [false],
        oneHundredFiftyTo200: [false],
        above200:             [false]
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
        if (data) {
          for (const collection of data) {
            if (collection.publishedAt !== null) {
              desiredCollections.push(collection);
            }
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
        if (data) {
          for (const collection of data) {
            if (collection.publishedAt !== null && collection.id !== 38583173235) {
              desiredCollections.push(collection);
            }
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
        if (data) {
          for (const product of data) {
            if (product.publishedAt !== null && product.id !== 4516235673709) {
              desiredProducts.push(product);
            }
          }
        }
      },
      err => { },
      () => this.loadingService.end()
    )

    return desiredProducts;
  }

  /**
   * Return a list of products created within the last 6 months.
   */
  getNewProducts(): Product[] {
    return this.productsService.getNewProducts();
  }

  /**
   * Get all the products from a particular collection and currently published in the store.
   * @param collectionId id of the collection to get products from
   * @param filters a list of products to filter by. If an empty array, then get product anyway
   */
  getProductsByCollection(collectionId: number, ...filters: Product[]): Product[] {
    const desiredProducts: Product[] = [];

    this.loadingService.start();
    this.productsService.getProductsByCollection(collectionId).subscribe(
      data => {
        if (data) {
          for (const product of data) {
            if (product.publishedAt && product.id !== 4516235673709) {
              if (!filters || !filters.length || filters.some(p => p.id === product.id)) {
                desiredProducts.push(product);
              }
            }
          }
        }
      },
      err => { },
      () => this.loadingService.end()
    );

    return desiredProducts;
  }

  /**
   * Checks whether a variant is available.
   * @param variant variant to check
   * @returns true even if inventory is not tracked
   */
  isVariantAvailable(variant: Variant): boolean {
    return this.productsService.isVariantAvailable(variant);
  }

  /**
   * Checks whether a product is available.
   * @param product product to check
   * @returns true even if inventory is not tracked
   */
  isProductAvailable(product: Product): boolean {
    return this.productsService.isProductAvailable(product);
  }

  /**
   * Returns the number available of this variant.
   * @param variant variant to check quantity of
   * @returns null if inventory is not tracked
   */
  getAvailable(variant: Variant): number {
    return this.productsService.getAvailable(variant);
  }


  /**
   * Get selected price ranges from the priceControls FormGroup.
   * @returns an array of the control names for each selection
   */
  getPriceSelections(): string[] {
    const selections: string[] = [];

    Object.keys(this.priceControls.controls).forEach( key => {
      if (this.priceControls.get(key).value) {
        selections.push(key);
      }
    });

    return selections;
  }

  getFilterNames(): string[] {
    return getFilterNames(this.filters);
  }

  /**
   * Apply selected filters and filter the products list to
   * only show those pertaining to the selections.
   * 
   * Acts as submission for the filters form.
   */
  applyFilters() {
    this.productsList           = this.getAllProducts();

    let products:     Product[] = this.getAllProducts();
    const newFilters: Filter[]  = [];

    /** NEW ONLY FILTER */
    let newProducts: Product[] = [];
    if (this.newOnlyControl.value) {
      newFilters.push({name: 'new only', value: this.newOnlyControl});
      newProducts = this.getNewProducts();
    }

    /** HAS PICTURE FILTER */
    let imageProducts: Product[] = [];
    if (this.hasPictureControl.value) {
      newFilters.push({name: 'has picture', value: this.hasPictureControl})
      imageProducts = products.filter(p => p.images.length > 0);
    }

    /** PRICE RANGE FILTER */
    const priceSelections       = this.getPriceSelections();
    const results: Set<Product> = new Set();
    if (priceSelections.length) {

      priceSelections.forEach( s => {
        this.productsList.forEach( p => {
          switch(s) {
            case 'under10':
              newFilters.push({name: '$10 and under', value: this.priceControls.get(s)});
              for (const v of p.variants) {
                if (Number(v.price) <= 10) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'tenTo25':
              newFilters.push({name: '$10 - $25', value: this.priceControls.get(s)});
              for (const v of p.variants) {
                if (Number(v.price) >= 10 && Number(v.price) <= 25) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'twentyFiveTo50':
              newFilters.push({name: '$25 - $50', value: this.priceControls.get(s)});
              for (const v of p.variants) {
                if (Number(v.price) >= 25 && Number(v.price) <= 50) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'fiftyTo75':
              newFilters.push({name: '$50 - $75', value: this.priceControls.get(s)});
              for (const v of p.variants) {
                if (Number(v.price) >= 50 && Number(v.price) <= 75) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'seventyFiveTo100':
              newFilters.push({name: '$75 - $100', value: this.priceControls.get(s)});
              for (const v of p.variants) {
                if (Number(v.price) >= 75 && Number(v.price) <= 100) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'oneHundredTo150':
              newFilters.push({name: '$100 - $150', value: this.priceControls.get(s)});
              for (const v of p.variants) {
                if (Number(v.price) >= 100 && Number(v.price) <= 150) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'oneHundredFiftyTo200':
              newFilters.push({name: '$150 - $200', value: this.priceControls.get(s)});
              for (const v of p.variants) {
                if (Number(v.price) >= 150 && Number(v.price) <= 200) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'above200':
              newFilters.push({name: '$200 and above', value: this.priceControls.get(s)});
              for (const v of p.variants) {
                if (Number(v.price) >= 200) {
                  results.add(p);
                  break;
                }
              }
              break;
            }
        })
      })
    
    }
    let priceFilter = [...results];

    /** APPLYING THE FILTERS */
    if (this.collectionsControl.value) {
      const value = this.collectionsControl.value.split('_');

      newFilters.push({name: value[0], value: this.collectionsControl});
      products   = this.getProductsByCollection(value[1], ...priceFilter, ...newProducts, ...imageProducts);
    } else {
      if (newProducts.length) {
        products = this.productsService.getNewProducts();
      }
      if (priceFilter.length) {
        products = products.filter(p => priceFilter.some(item => item.id === p.id));
      }
      if (imageProducts.length) {
        products = products.filter(p => imageProducts.some(item => item.id === p.id));
      }
    }

    this.filters      = uniqBy(newFilters, 'value');
    this.productsList = products;
  }

  /**
   * Reset the filters list and get all products.
   */
  resetFilters() {
    this.filters      = [];
    this.productsList = this.getAllProducts();
  }

  /**
   * Remove a selected filter and update the product list to reflect this.
   * @param filter a filter object or the name of a filter
   */
  removeFilter(filter: any) {
    if (!isFilter(filter)) {
      filter = findFilterByName(filter, this.filters);
    }

    this.filters = this.filters.filter(f => f.value !== filter.value);
    filter.value.reset();
    
    this.applyFilters();
  }

}
