// React
import React from 'react';

import algoliasearch from 'algoliasearch/lite';
import type { Hit } from 'instantsearch.js';
import aa from 'search-insights';
import type { SendEventForHits } from 'instantsearch.js/es/lib/utils';
import { Autocomplete } from './components/Autocomplete';

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
} from 'react-instantsearch';
import {
  FrequentlyBoughtTogether,
  RelatedProducts,
  TrendingItems
} from '@algolia/recommend-react';
// import { useConnector } from 'react-instantsearch';

// Recommend
import recommend from '@algolia/recommend';
import { TrendingItem } from './components/TrendingItem';

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
          <a href="/">UNESCO World Heritage Site Finder</a>
        </h1>
        <SearchBox placeholder="Discover a heritage site near you..." className="searchbox" />
      </header>

      <div className="container">
          <Configure hitsPerPage={10} 
          />
          <div className="search-panel">
            <div className="search-panel__filters">
              <CurrentRefinements includedAttributes={['category','states_name_en']} className="current-refinements"/>
              <ClearRefinements 
                includedAttributes={['category','states_name_en']}
                translations={{
                  resetButtonText: 'Clear all',
                }}
                className="clearRefinements"
                />
              <HierarchicalMenu
                attributes={[
                  "hierarchy.LVL0",
                  "hierarchy.LVL1"
                ]}
              />
              <DynamicWidgets fallbackComponent={RefinementList}>
                <RefinementList
                  attribute={'category'}
                  className="category"
                />
                <RefinementList
                  attribute={'states_name_en'}
                  showMore={true}
                  searchable
                />
              </DynamicWidgets>
            </div>

            <div className="search-panel__results">
              {/* <Autocomplete
                placeholder="Search products"
                detachedMediaQuery="none"
                openOnFocus
              /> */}
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
                <div className="trending">                
                  <TrendingItems
                  recommendClient={recommendClient}
                  indexName={indexName}
                  maxRecommendations={4}
                  itemComponent={TrendingItem}
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
    if (flag.includes('Top')) {
      flagClass = 'flag-top';
      flagText = 'Global Peace Index Top 10';
    } else if (flag.includes('Bottom')) {
      flagClass = 'flag-bottom';
      flagText = 'Global Peace Index Bottom 50';
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