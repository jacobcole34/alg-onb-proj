import React from 'react';
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
import { FrequentlyBoughtTogether, TrendingItems} from '@algolia/recommend-react';
import { MapContainer, TileLayer } from 'react-leaflet';

// Components
import Hit from './components/Hit';
import AlgoliaHitModal from './components/AlgoliaHitModal';
import { Sites } from './components/Sites';
import { TrendingItem } from './components/TrendingItem';
import { RelatedItem } from './components/RelatedItem'

// CSS
import './App.css';

// searchClient, recommendClient, index, aa
const searchClient = algoliasearch(
  '4SKQ3KZ62A',
  'a54a9c30ef9bf61a392498d6db48f6b3'
);
const recommendClient = recommend('4SKQ3KZ62A', 'a54a9c30ef9bf61a392498d6db48f6b3');
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
        <div className="background">

            <header className="header">
              <h1 className="header-title">
                <a href="/">🌍 UNESCO World Heritage Site Finder</a>
              </h1>
              <SearchBox placeholder="Discover a heritage site near you..." className="searchbox" />
              {/* <Autocomplete
                placeholder="Search products"
                detachedMediaQuery="none"
                openOnFocus
                className="searchbox"
                /> */}
            </header>
            <div className="container">
                <Configure hitsPerPage={10} 
                />
                <div className="search-panel">
                  <div className="search-panel__filters">
                    <CurrentRefinements includedAttributes={['category','flag', 'hierarchy.LVL0', 'hierarchy.LVL1']} className="current-refinements"/>
                    <ClearRefinements 
                      includedAttributes={['category','states_name_en']}
                      translations={{
                        resetButtonText: 'Clear all',
                      }}
                      className="clearRefinements"
                      />
                    <div><HierarchicalMenu
                      attributes={[
                        "hierarchy.LVL0",
                        "hierarchy.LVL1"
                      ]}
                      limit={50}
                      showMore={true}
                      showMoreLimit={100}
                    /></div>
                    <DynamicWidgets fallbackComponent={RefinementList}>
                      <RefinementList
                        attribute={'category'}
                        className="category"
                      />
                      <RefinementList
                        attribute={'states_name_en'}
                        showMore={true}
                      />
                    </DynamicWidgets>
                  </div>

                  <div className="search-panel__results">
                  <MapContainer
                      className="map"
                      center={[48.85, 2.35]}
                      zoom={10}
                      minZoom={4}
                      scrollWheelZoom={true}
                    >
                      <Sites />
                      <TileLayer
                        attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                  </MapContainer>
                  <SortBy
                    items={[
                      { label: 'Sort A-Z', value: 'instant_search' },
                      { label: 'A-Z', value: 'instant_search_price_asc' },
                      { label: 'Z-A', value: 'instant_search_price_desc' },
                    ]}
                  />
                    <Hits hitComponent={Hit}>
                    <AlgoliaHitModal />
                    </Hits>
                    <div className="pagination">
                      <Pagination />
                      <div className="trending">                
                      <FrequentlyBoughtTogether
                        recommendClient={recommendClient}
                        indexName={indexName}
                        objectIDs={['c876a922f0bf8_dashboard_generated_id']}
                        itemComponent={RelatedItem}
                      />
                      <TrendingItems
                        recommendClient={recommendClient}
                        indexName={indexName}
                        maxRecommendations={4}
                        itemComponent={TrendingItem}
                        // view={ListView}
                      />
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            <div>
            </div>

        </div>
      </div>
    </InstantSearch>
  );
}
