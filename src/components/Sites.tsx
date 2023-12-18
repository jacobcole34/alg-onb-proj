import React, { useState } from 'react';
import { Marker, Popup, useMapEvents } from 'react-leaflet';
import { useGeoSearch, useSearchBox } from 'react-instantsearch';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export function Sites() {

  const { query, refine: refineQuery } = useSearchBox();
  const {
    items,
    refine: refineItems,
    currentRefinement,
    clearMapRefinement,
  } = useGeoSearch();

  const [previousQuery, setPreviousQuery] = useState(query);
  const [skipViewEffect, setSkipViewEffect] = useState(false);

  // When the user moves the map, we clear the query if necessary to only
  // refine on the new boundaries of the map.
  const onViewChange = ({ target }) => {
    setSkipViewEffect(true);

    if (query.length > 0) {
      refineQuery('');
    }

    refineItems({
      northEast: target.getBounds().getNorthEast(),
      southWest: target.getBounds().getSouthWest(),
    });
  };

  const map = useMapEvents({
    zoomend: onViewChange,
    dragend: onViewChange,
  });

  // When the query changes, we remove the boundary refinement if necessary and
  // we center the map on the first result.
  if (query !== previousQuery) {
    if (currentRefinement) {
      clearMapRefinement();
    }

    // `skipViewEffect` allows us to bail out of centering on the first result
    // if the query has been cleared programmatically.
    if (items.length > 0 && !skipViewEffect) {
      map.setView(items[0]._geoloc);
    }

    setSkipViewEffect(false);
    setPreviousQuery(query);
  }

  return (
    <>
      {items.map((hit) => (
        <Marker key={hit.objectID} position={hit._geoloc}>
          <Popup>
            <strong>{hit.name_en}</strong>
            <br />
            <img
              src={hit.image}
              style={{ maxWidth: '100px', maxHeight: '100px' }}
            />
            <br />
            <strong>
              {hit.states_name_en}, {hit.category}
            </strong>
            <br />
            {hit.short_description_en}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
