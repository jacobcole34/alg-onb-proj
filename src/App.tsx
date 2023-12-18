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
import { SearchBoxWithSuggestions } from './components/CustomSearch';
// import { CustomSearch } from './components/CustomSearch';

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

  const [geoLocation, setGeoLocation] = useState(null);

  async function getGeoLocationAndCenterMap() {
    const location = await fetchGeoLocation();
    if (location) {
      setGeoLocation(location);
      // console.log('location is  ', location);
      // console.log('geoLocation is  ', geoLocation);
      window.location.reload();
    }
  }

  console.log(geoLocation);

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

        </header>
        <div className="background">
          <div className="container">
            <Configure
              hitsPerPage={100} // add geo query parameters => use state hooks to change
            />
            <div className="search-panel">
              <div className="facets-filters">
              <button onClick={getGeoLocationAndCenterMap} className="link-button2">Find Near Me</button><br />
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
                  translations={{
                    resetButtonText: 'Clear All',
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
                  center={geoLocation ? [location.latitude, location.longitude] :[33.7043, -84.3742]}
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
                <div className="allhits">
                  <Hits hitComponent={Hit}/>
                  <div className="pagination">
                    <Pagination />
                  </div>
                </div>
              </div>
              <div className="trending">
                <TrendingItems
                  recommendClient={recommendClient}
                  indexName={indexName}
                  maxRecommendations={7}
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

async function fetchGeoLocation() {
  try {
    const response = await fetch('http://ip-api.com/json');
    if (!response.ok) {
      throw new Error('Unable to fetch geo-location.');
    }
    const data = await response.json();
    return {
      latitude: data.lat,
      longitude: data.lon,
    };
  } catch (error) {
    console.error('Error fetching geo-location:', error);
    return null;
  }
}
