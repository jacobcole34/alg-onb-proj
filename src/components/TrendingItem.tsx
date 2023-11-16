import React from 'react';
import { TrendingItems } from '@algolia/recommend-react';
import recommend from '@algolia/recommend';

const recommendClient = recommend('4SKQ3KZ62A', 'a54a9c30ef9bf61a392498d6db48f6b3');
const indexName = 'dev_unesco_transformed';

export function TrendingItem({ item }) {
    console.log(item);
    return (
        <>
            <p>{item.name_en}</p>
            <img src={item.image} style={{ maxWidth: '100%', height: 'auto' }} />
        </>
    );
  }