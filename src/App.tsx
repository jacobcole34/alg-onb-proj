import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import aa from 'search-insights';

// InstantSearch
import {
  Configure,
  DynamicWidgets,
  RefinementList,
  ClearRefinements,
  CurrentRefinements,
  HierarchicalMenu,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  SortBy,
} from 'react-instantsearch';

//Recommend
import recommend from '@algolia/recommend';
import { FrequentlyBoughtTogether, TrendingItems } from '@algolia/recommend-react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { TrendingItem, TrendingHeader } from './components/TrendingItem';
import { RelatedItem, RelatedHeader } from './components/RelatedItem';

// Components
import Hit from './components/Hit';
import AlgoliaHitModal from './components/AlgoliaHitModal';
import { Sites } from './components/Sites';

// CSS
import './App.css';

// searchClient, recommendClient, index, aa
const searchClient = algoliasearch(
  '4SKQ3KZ62A',
  'a54a9c30ef9bf61a392498d6db48f6b3'
);
const recommendClient = recommend(
  '4SKQ3KZ62A',
  'a54a9c30ef9bf61a392498d6db48f6b3'
);
const indexName = 'dev_unesco_transformed';
aa('init', {
  appId: '4SKQ3KZ62A',
  apiKey: 'a54a9c30ef9bf61a392498d6db48f6b3',
  partial: true,
  useCookie: true,
  cookieDuration: 1 * 15552000000,
});

export function App() {

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="dev_unesco_transformed"
      insights={true}
      routing
    >
      <div>
        <header className="header">
          <h1 className="header-title">
            <a href="/">🌍 UNESCO World Heritage Site Finder</a>
          </h1>
          <SearchBox
            placeholder="Discover a heritage site near you..."
            className="searchbox"
          />
          {/* <Autocomplete
            placeholder="Search products"
            detachedMediaQuery="none"
            openOnFocus
            className="searchbox"
            /> */}
        </header>
        <div className="background">
          <div className="container">
            <Configure
              hitsPerPage={5} // add geo query parameters => use state hooks to change
            />
            <div className="search-panel">
              <div className="facets-filters">
                <CurrentRefinements
                  includedAttributes={[
                    'category',
                    'flag',
                    'hierarchy.LVL0',
                    'hierarchy.LVL1',
                  ]}
                  className="current-refinements"
                />
                <ClearRefinements
                  includedAttributes={['category', 'states_name_en']}
                  translations={{
                    resetButtonText: 'Clear all',
                  }}
                  className="clearRefinements"
                />
                <div>
                  <HierarchicalMenu
                    attributes={['hierarchy.LVL0', 'hierarchy.LVL1']}
                    limit={50}
                    showMore={true}
                    showMoreLimit={100}
                  />
                </div>
                <DynamicWidgets fallbackComponent={RefinementList}>
                  <RefinementList attribute={'category'} className="category" />
                  <RefinementList
                    attribute={'states_name_en'}
                    showMore={true}
                  />
                </DynamicWidgets>
              </div>

              <div className="middle">
                <MapContainer
                  className="map"
                  center={[48.85, 2.35]}
                  zoom={10}
                  minZoom={1}
                  scrollWheelZoom={true}
                >
                  <Sites />
                  <TileLayer
                    attribution={
                      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    className="tiles"
                  />
                </MapContainer>
                <br />
                <SortBy
                  items={[
                    { label: 'Sort A-Z', value: 'dev_unesco_transformed' },
                    { label: 'A-Z', value: 'dev_unesco_transformed_az' },
                    { label: 'Z-A', value: 'dev_unesco_transformed_za' },
                  ]}
                />
                <br />
                <div class="allhits">
                  <Hits hitComponent={Hit}/>
                  <div className="pagination">
                    <Pagination />
                  </div>
                </div>
              </div>
              <div className="trending">
                <FrequentlyBoughtTogether
                  recommendClient={recommendClient}
                  indexName={indexName}
                  objectIDs={['c876a922f0bf8_dashboard_generated_id']}
                  itemComponent={RelatedItem}
                  headerComponent={RelatedHeader}
                />
                <TrendingItems
                  recommendClient={recommendClient}
                  indexName={indexName}
                  maxRecommendations={5}
                  itemComponent={TrendingItem}
                  headerComponent={TrendingHeader}
                  // view={ListView}
                />
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </InstantSearch>
  );
}
