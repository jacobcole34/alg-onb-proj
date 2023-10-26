import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  Configure,
  DynamicWidgets,
  RefinementList,
  ClearRefinements,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
} from 'react-instantsearch';
import type { Hit } from 'instantsearch.js';
import './App.css';

const searchClient = algoliasearch(
  '4SKQ3KZ62A',
  'a54a9c30ef9bf61a392498d6db48f6b3'
);

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
              <ClearRefinements 
                includedAttributes={['category','states_name_en']}
                translations={{
                  resetButtonText: 'Clear all',
                }}
                className="clearRefinements"
                />
              <DynamicWidgets fallback={RefinementList}>
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
  sendEvent: any;
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
        <a href={hit.link}><button className="link-button">Learn More</button></a>
        <FavoriteButton {...hit}/><Highlight attribute="region_en" hit={hit} />
        </p>
      </div>
    </article>
  );
}

const FavoriteButton = (props) => {
  const handleClick = () => {
    console.log('JC: Conversion Clicked');
    const apiKey = 'a54a9c30ef9bf61a392498d6db48f6b3';

    const eventData = {
      eventName: 'favorited',
      eventType: 'conversion',
      index: 'dev_unesco_transformed',
      // userToken: "jacob",
      objectIDs: [`${props.objectID}`],
      timestamp: new Date().toISOString(),
    };
  };

  return (
    <button className="favorites" onClick={handleClick}>
      🩵&nbsp;&nbsp;Save to Favorites
    </button>
  );
};

