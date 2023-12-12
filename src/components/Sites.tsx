// Airports.tsx
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useGeoSearch } from 'react-instantsearch';

type Site = {
  name: string;
  city: string;
  country: string;
  iata_code: string;
  links_count: number;
}

export function Sites() {
  const {
    items,
  } = useGeoSearch<Site>();

  return (
    <>
      {items.map((hit) => (
        <Marker
          key={hit.objectID}
          position={hit._geoloc}
        >
          <Popup>
            <strong>{hit.name_en}</strong>
            <br />
              <img src={hit.image} style={{ maxWidth: '100px', maxHeight: '100px' }}/>
            <br />
              <strong>{hit.states_name_en}, {hit.category}</strong><br />
              {hit.short_description_en}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
