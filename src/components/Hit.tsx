import React, { useState } from 'react';
import { Highlight } from 'react-instantsearch';
import type { Hit } from 'instantsearch.js';
import FavoriteButton from './FavoriteButton';
import { HitProps } from '../typeDefs';
import { AlgoliaHitModal } from './AlgoliaHitModal';
import { RelatedItem, RelatedHeader } from './RelatedItem';
import recommend from '@algolia/recommend';
import { FrequentlyBoughtTogether, TrendingItems } from '@algolia/recommend-react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import '@algolia/ui-components-horizontal-slider-theme';

const recommendClient = recommend(
  '4SKQ3KZ62A',
  'a54a9c30ef9bf61a392498d6db48f6b3'
);
const indexName = 'dev_unesco_transformed';

// Define the AlternativeContent component
function AlternativeContent({ objectID }: { objectID: string }) {
  return (
    <div className="frequently">
      <div className="frequently-child">
        <FrequentlyBoughtTogether
          recommendClient={recommendClient}
          indexName={indexName}
          objectIDs={[objectID]} // Pass the objectID as a prop to the component
          itemComponent={RelatedItem}
          headerComponent={RelatedHeader}
          view={HorizontalSlider}
        />
      </div>
    </div>
  );
}

function Hit({ hit, sendEvent }: HitProps) {
  const [showSimilar, setShowSimilar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleSeeSimilarClick = () => {
    setShowSimilar(!showSimilar);
  };

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
    } else if (flag.includes('Bottom 20')) {
      flagClass = 'flag-bottom';
      flagText = 'Global Peace Index Bottom 20';
    }
  }

  return (
    <article className="hit">
      {showSimilar ? (
        // Display the alternative content when showSimilar is true
        <AlternativeContent objectID={hit.objectID} />
      ) : (
        // Display the main content when showSimilar is false
        <>
          {/* Your existing content here */}
          {hit.image && (
            <div className="hit-thumbnail">
              <img src={hit.image} alt={hit.name_en} />
            </div>
          )}
          <div className="hit-content">
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
              <strong>Country: </strong>
              <Highlight attribute="states_name_en" hit={hit} />
              {flagText && <span className={`flag ${flagClass}`}>{flagText}</span>}
            </p>
            <p className="parent-container">
              <a href={hit.link} target="_blank">
                <button className="link-button">Learn More</button>
              </a>
              <button onClick={handleSeeSimilarClick} className="link-button">
                See Similar
              </button>
              <FavoriteButton hit={hit} sendEvent={sendEvent} />
              <Highlight attribute="region_en" hit={hit} />
            </p>
          </div>
        </>
      )}
    </article>
  );
}

export default Hit;
