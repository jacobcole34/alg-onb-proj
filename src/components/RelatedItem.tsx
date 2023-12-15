import React from 'react';

export function RelatedHeader(props) {
  return <h3 className="header-h3">SIMILAR FAVORITES</h3>;
}

export function RelatedItem({ item }) {
  return (
    <div className="trenditem">
      <a href={item.link} target="_blank">
        <p>{item.name_en}</p>
        <img src={item.image} style={{ maxWidth: '100%', height: 'auto' }} />
      </a>
    </div>
  );
}

// https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-react/FrequentlyBoughtTogether/#param-headercomponent
