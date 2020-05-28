import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { environment } from 'src/environments/environment';
import { setContext } from 'apollo-link-context';

//https://{apikey}:{password}@{hostname}/admin/api/{version}/{resource}.json


export function provideApollo(httpLink: HttpLink) {

  const apikey = environment["ADMIN_API_KEY"];
  const password = environment["ADMIN_PASSWORD"];
  const uri = 'https://practical-parts.myshopify.com/admin/api/2020-04/graphql.json'; // <-- add the URL of the GraphQL server here

  const auth = setContext((operation, context) => ({
    headers: {
      authorization: `X-Shopify-Access-Token: ${password}`
    }
  }));

  const link = ApolloLink.from([auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache
  }

}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: provideApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
