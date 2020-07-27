import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { ProductsService, Product } from 'src/app/services/products.service';
import { CollectionsService, Collection } from 'src/app/services/collections.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { BehaviorSubject, Observable, range } from 'rxjs';
import { __values } from 'tslib';
import { filter } from 'rxjs/operators';
import { prod } from '@scullyio/scully';

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
  filters:               string[];
  priceFilter:           Product[];

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
    this.priceFilter           = [];
  }

  get collectionsControl() { return this.filtersForm.get('collections'); }
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
          console.log(data)
          for (const product of data) {
            if (product.publishedAt && product.id !== 4516235673709) {
              if (filters) {
                console.log(filters.includes(product))
              }
              if (!filters || !filters.length || filters.includes(product)) {
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

  getPriceSelections(): string[] {
    const selections: string[] = [];

    Object.keys(this.priceControls.controls).forEach( key => {
      if (this.priceControls.get(key).value) {
        selections.push(key);
      }
    });

    return selections;
  }

  /**
   * Apply selected filters and filter the products list to
   * only show those pertaining to the selections.
   * 
   * Acts as submission for the filters form.
   */
  applyFilters() {
    let products:     Product[]   = this.getAllProducts();
    const newFilters: Set<string> = new Set();

    const priceSelections       = this.getPriceSelections();
    const results: Set<Product> = new Set();
    if (priceSelections.length) {

      priceSelections.forEach( s => {
        this.productsList.forEach( p => {
          switch(s) {
            case 'under10':
              newFilters.add('$10 and under');
              for (const v of p.variants) {
                if (Number(v.price) <= 10) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'tenTo25':
              newFilters.add('$10 - $25');
              for (const v of p.variants) {
                if (Number(v.price) >= 10 && Number(v.price) <= 25) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'twentyFiveTo50':
              newFilters.add('$25 - $50');
              for (const v of p.variants) {
                if (Number(v.price) >= 25 && Number(v.price) <= 50) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'fiftyTo75':
              newFilters.add('$50 - $75');
              for (const v of p.variants) {
                if (Number(v.price) >= 50 && Number(v.price) <= 75) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'seventyFiveTo100':
              newFilters.add('$75 - $100');
              for (const v of p.variants) {
                if (Number(v.price) >= 75 && Number(v.price) <= 100) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'oneHundredTo150':
              newFilters.add('$100 - $150');
              for (const v of p.variants) {
                if (Number(v.price) >= 100 && Number(v.price) <= 150) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'oneHundredFiftyTo200':
              newFilters.add('$150 - $200');
              for (const v of p.variants) {
                if (Number(v.price) >= 150 && Number(v.price) <= 200) {
                  results.add(p);
                  break;
                }
              }
              break;
            case 'above200':
              newFilters.add('$200 and above');
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
    this.priceFilter = [...results];

    if (this.collectionsControl.value) {
      const value = this.collectionsControl.value.split('_');

      newFilters.add(value[0]);
      products    = this.getProductsByCollection(value[1], ...this.priceFilter);
    }

    this.filters      = [...newFilters];
    this.productsList = products;
  }

}
