import React from 'react';
import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';

export function RelatedHeader(props) {
  return <h3 className="header-h3">TRAVELERS ALSO FAVORITED</h3>;
}

export function RelatedItem({ item } ) {
  return (
    <div className="related-item">
      <p className="item-name">{item.name_en}</p>
      <a href={item.link} target="_blank">
        <img
          src={item.image}
          alt={item.name_en}
          className="item-image"
        />
      </a>
    </div>
  );
}
