// React
import React from 'react';
import Modal from 'react-modal';

import algoliasearch from 'algoliasearch/lite';
import type { Hit } from 'instantsearch.js';
import aa from 'search-insights';
import type { SendEventForHits } from 'instantsearch.js/es/lib/utils';
import { Autocomplete } from './components/Autocomplete';
import { 
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

// InstantSearch
import {
  Configure,
  DynamicWidgets,
  RefinementList,
  ClearRefinements,
  CurrentRefinements,
  HierarchicalMenu,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  useGeoSearch
} from 'react-instantsearch';
import {
  FrequentlyBoughtTogether,
  RelatedProducts,
  TrendingItems
} from '@algolia/recommend-react';
// import { useConnector } from 'react-instantsearch';

// Recommend
import recommend from '@algolia/recommend';
import { TrendingItem, ListView } from './components/TrendingItem';
import { RelatedItem } from './components/RelatedItem'

import { HitProps } from './typeDefs';
import './App.css';

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
    <div>
      <div className="background">
        <InstantSearch
              searchClient={searchClient}
              indexName="dev_unesco_transformed"
              insights={true}
              routing
            >
          <header className="header">
            <h1 className="header-title">
              <a href="/">🌍 UNESCO World Heritage Site Finder</a>
            </h1>
            <SearchBox placeholder="Discover a heritage site near you..." className="searchbox" />
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
                  <Hits hitComponent={Hit} />

                  <div className="pagination">
                    <Pagination />
                    <MapContainer
                      className="map"
                      center={[48.85, 2.35]}
                      zoom={10}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    </MapContainer>
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
        </InstantSearch>
      </div>
    </div>
  );
}


function Hit({ hit, sendEvent }: HitProps) {
  const flag = hit.flag;
  let flagClass = '';
  let flagText = '';

  if (flag) {
    flagText = flag;
    if (flag.includes('Top 10')) {
      flagClass = 'flag-top';
      flagText = 'Global Peace Index Top 10';
    } else if (flag.includes('Top 20')) {
      flagClass = 'flag-top';
      flagText = 'Global Peace Index Top 20';
    } else if (flag.includes('Bottom 50')) {
      flagClass = 'flag-bottom';
      flagText = 'Global Peace Index Bottom 50';
    }
    else if (flag.includes('Bottom 20')) {
      flagClass = 'flag-bottom';
      flagText = 'Global Peace Index Bottom 20';
    }
  }

  return (
     <article className="hit">
      {hit.image && (
        <div className="hit-thumbnail">
          <img src={hit.image} alt={hit.name_en} />
        </div>
      )}
      <div className="hit-content" onClick={()=>console.log('JC: Hit Clicked')}>
        <h1>
          <Highlight attribute="name_en" hit={hit} />
        </h1>
        <p>
          <Highlight attribute="short_description_en" hit={hit} />
        </p>
        <p>
          <Highlight attribute="category" hit={hit} />
        </p>
        <p>
          <strong>Country: </strong><Highlight attribute="states_name_en" hit={hit} />
          {flagText && (
            <span className={`flag ${flagClass}`}>{flagText}</span>
          )}
        </p>
        <p className="parent-container">
        <a href={hit.link} target="_blank"><button className="link-button">Learn More</button></a>
        <FavoriteButton hit={hit} sendEvent={sendEvent} /><Highlight attribute="region_en" hit={hit} />
        </p>
      </div>
    </article>
  );
}

const FavoriteButton = ({hit, sendEvent}) => {

  return (
    <button className="favorites" onClick={(event)=> {console.log('Conversion'); event.stopPropagation(); sendEvent("conversion",hit,"Favorited")}}>
      🩵&nbsp;&nbsp;Save to Favorites
    </button>
  );
};

// function AlgoliaHitModal({ isOpen, onClose, hit }) {
//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Algolia Hit Modal"
//     >
//       <h2>Algolia Hit Details</h2>
//       <button onClick={onClose}>Close</button>
//       <div>
//         <p>ID: {hit.objectID}</p>
//         <p>Title: {hit.name_en}</p>
//         <p>Description: {hit.short_description_en}</p>
//       </div>
//     </Modal>
//   );
// }