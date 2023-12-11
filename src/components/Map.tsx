import { useGeoSearch } from 'react-instantsearch';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from 'react-leaflet';

export function CustomGeoSearch(props) {
  const { items, refine } = useGeoSearch(props);

  function onViewChange({ target }) {
    refine({
      northEast: target.getBounds().getNorthEast(),
      southWest: target.getBounds().getSouthWest(),
    });
  }

  useMapEvents({ zoomend: onViewChange, dragend: onViewChange });

  return (
    <MapContainer
      center={[48.85, 2.35]}
      zoom={10}
      minZoom={4}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {items.map((item) => (
        <Marker key={item.objectID} position={item._geoloc}>
          <Popup>
            <strong>{item.name}</strong>
            <br />
            {item.city}, {item.country}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}