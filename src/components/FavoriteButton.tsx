import React from 'react';

const FavoriteButton = ({ hit, sendEvent }) => {
  return (
    <button
      className="favorites"
      onClick={(event) => {
        console.log('Conversion');
        event.stopPropagation();
        sendEvent('conversion', hit, 'Favorited');
      }}
    >
      🩵&nbsp;&nbsp;Save to Favorites
    </button>
  );
};

export default FavoriteButton;
