import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  DynamicWidgets,
  RefinementList,
  ClearRefinements,
  CurrentRefinements,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
} from 'react-instantsearch';
import type { Hit } from 'instantsearch.js';
import aa from 'search-insights';
import type { SendEventForHits } from 'instantsearch.js/es/lib/utils';
import './App.css';

const searchClient = algoliasearch(
  '4SKQ3KZ62A',
  'a54a9c30ef9bf61a392498d6db48f6b3'
);

aa('init', {
  appId: '4SKQ3KZ62A',
  apiKey: 'a54a9c30ef9bf61a392498d6db48f6b3',
  partial: true,
  useCookie: true,
  cookieDuration: 1 * 15552000000,
});

export function App() {
  
  return (
    <div className="background">
      <header className="header">
        <h1 className="header-title">
          <a href="/">UNESCO World Heritage Site Finder</a>
        </h1>
      </header>

      <div className="container">
        <InstantSearch
          searchClient={searchClient}
          indexName="dev_unesco_transformed"
          insights={true}
        >
          <Configure hitsPerPage={10} 
          />
          <div className="search-panel">
            <div className="search-panel__filters">
              <CurrentRefinements includedAttributes={['category','states_name_en']}/>
              <ClearRefinements 
                includedAttributes={['category','states_name_en']}
                translations={{
                  resetButtonText: 'Clear all',
                }}
                className="clearRefinements"
                />
              <DynamicWidgets fallbackComponent={RefinementList}>
                <RefinementList
                  attribute={'category'}
                />
                <RefinementList
                  attribute={'states_name_en'}
                  showMore={true}
                  searchable
                />
              </DynamicWidgets>
            </div>

            <div className="search-panel__results">
              <SearchBox placeholder="Discover a heritage site near you..." className="searchbox" />
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

type HitProps = {
  hit: Hit;
  sendEvent: SendEventForHits;
};


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
  // handleClick = () => {

  //   console.log('JC: Conversion Clicked');

  //   hit.event.stopPropagation();

  //   hit.sendEvent('conversion', hit, 'Added To Cart');

  //   console.log('end handleclick')

  // };

  return (
    <button className="favorites" onClick={()=> {event?.stopPropagation();sendEvent("conversion",hit,"Favorited")}}>
      🩵&nbsp;&nbsp;Save to Favorites
    </button>
  );
};

