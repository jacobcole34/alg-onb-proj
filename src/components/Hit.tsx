import React, { useState } from 'react';
import { Highlight } from 'react-instantsearch';
import type { Hit } from 'instantsearch.js';
import FavoriteButton from "./FavoriteButton";
import { HitProps } from '../typeDefs';

function Hit({ hit, sendEvent }: HitProps) {

    const [selectedHit, setSelectedHit] = useState(null);
    const [isOpen, setIsModalOpen] = useState(false);
  
    const openModal = (hit) => {
      setSelectedHit(hit);
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setSelectedHit(null);
      setIsModalOpen(false);
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
            <strong>Country: </strong><Highlight attribute="states_name_en" hit={hit} />
            {flagText && (
              <span className={`flag ${flagClass}`}>{flagText}</span>
            )}
          </p>
          <p className="parent-container">
          <a href={hit.link} target="_blank"><button className="link-button">Learn More</button></a>
          <button onClick={(hit) => { console.log('Open Modal'); openModal(hit); }}>Open Modal</button>
          <FavoriteButton hit={hit} sendEvent={sendEvent} /><Highlight attribute="region_en" hit={hit} />
          </p>
        </div>
      </article>
    );
  }

export default Hit;