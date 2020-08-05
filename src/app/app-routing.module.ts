import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';


const routes: Routes = [
  { 
    path: '',
    component: HomeComponent,
    data: {
      breadcrumb: 'Home',
    },
    children: [
      {
        path: 'products',
        component: ProductsComponent,
        data: {
          breadcrumb: 'Products',
        },
      }, {
        path: 'about',
        component: AboutComponent,
        data: {
          breadcrumb: 'About Practical Parts',
        },
      }, {
        path: 'contact',
        component: ContactComponent,
        data: {
          breadcrumb: 'Contact Information',
        },
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
