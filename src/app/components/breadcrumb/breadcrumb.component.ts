import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { IBreadcrumb } from './breadcrumb';
import { filter, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.sass']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadcrumb[]

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd), distinctUntilChanged(),
    ).subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    })
  }

  /**
   * Recursively build breadcrumb according to activated route.
   * @param route
   * @param url
   * @param breadcrumbs
   */
  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
    let label =
      route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : "";
    let path =
      route.routeConfig && route.routeConfig.data ? route.routeConfig.path : "";

    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadcrumb = {
      label: label,
      url: nextUrl
    };

    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];

    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }

    // if on home page, then don't show
    if (newBreadcrumbs.length == 1)
      return null;

    return newBreadcrumbs;
  }
}
