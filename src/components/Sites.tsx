import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { useGeoSearch } from 'react-instantsearch';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export function Sites() {
  const {
    items,
  } = useGeoSearch();

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
