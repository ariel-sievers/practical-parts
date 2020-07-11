import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { SearchBarComponent } from './components/header/search-bar/search-bar.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ScullyLibModule } from '@scullyio/ng-lib-v8';
import { CardModule } from './modules/card/card.module';
import { GenericImageComponent } from './components/generic-image/generic-image.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ProductsComponent,
    AboutComponent,
    ContactComponent,
    HomeComponent,
    NavbarComponent,
    SearchBarComponent,
    BreadcrumbComponent,
    CarouselComponent,
    GenericImageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CardModule,
    ScullyLibModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
