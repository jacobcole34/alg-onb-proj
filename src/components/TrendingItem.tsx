import React from 'react';

export function TrendingHeader(props) {
  return <h3 className="header-h3">POPULAR HERITAGE SITES</h3>;
}

export function TrendingItem({ item }) {
  return (
    <div className="trenditem">
      <a href={item.link} target="_blank">
        <p>{item.name_en}</p>
        <img src={item.image} style={{ maxWidth: '100%', height: 'auto' }} />
      </a>
    </div>
  );
}

export function ListView(props) {
  return (
    <div>
      {props.items.map((item) => (
        <div key={item.objectID}>
          <props.itemComponent item={item} />
        </div>
      ))}
    </div>
  );
}
