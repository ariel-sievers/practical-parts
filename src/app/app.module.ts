import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HeaderComponent } from './components/header/header.component';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { FooterComponent } from './components/footer/footer.component';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/header/navbar/navbar.component';
import { SearchBarComponent } from './components/header/search-bar/search-bar.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { InMemoryCache } from 'apollo-cache-inmemory';

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
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    ApolloModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    HttpLinkModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
