import React from 'react';

export function RelatedItem({ item }) {
    return (
        <div className="trenditem">
            <a href={item.link} target="_blank">
            <p>{item.name_en}</p>
            <img src={item.image} style={{ maxWidth: '100%', height: 'auto' }}/>
            </a>
        </div>
    );
  }

