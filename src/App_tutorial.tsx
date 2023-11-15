import React from "react";

import algoliasearch from "algoliasearch/lite";
import { Hit as AlgoliaHit } from "instantsearch.js/es/types";
import { Autocomplete } from "./AutoComplete";

import {
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
} from "react-instantsearch";

import "./App.css";

const searchClient = algoliasearch(
  "latency",
  "6be0576ff61c053d5f9a3225e2a90f76"
);

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    image: string;
    brand: string;
    categories: string[];
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <article className="hit">
      <div className="hit-image">
        <img src={hit.image} alt={hit.name} />
      </div>
      <div>
        <h1>
          <Highlight hit={hit} attribute="name" />
        </h1>
        <div>
          By <strong>{hit.brand}</strong> in{" "}
          <strong>{hit.categories[0]}</strong>
        </div>
      </div>
    </article>
  );
}

export function App() {
  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName="instant_search"
        routing
      >
        <header className="header">
          <div className="header-wrapper wrapper">
            <nav className="header-nav">
              <a href="/">Home</a>
            </nav>
            <Autocomplete
              placeholder="Search products"
              detachedMediaQuery="none"
              openOnFocus
            />
          </div>
        </header>
        <div className="container wrapper">
          <div>
            <RefinementList attribute="brand" />
          </div>
          <div>
            <Hits hitComponent={Hit} />
            <Pagination />
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}