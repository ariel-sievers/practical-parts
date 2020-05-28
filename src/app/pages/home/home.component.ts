import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { GraphQLError } from 'graphql';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  shop: any;
  loading = true;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.testQuery();
  }

  testQuery() {
    return this.apollo
      .watchQuery({
        query: gql`
          query {
            shop {
              id
              name
              email
            }
          }
        `,
      })
      .valueChanges.subscribe(result => {
        this.shop = result.data
        this.loading = result.loading;
      });
  }

}
