import React from 'react';
import Modal from 'react-modal';

export function AlgoliaHitModal({ isOpen, onClose, hit }) {
  return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Algolia Hit Modal"
      >
        <h2>Algolia Hit Details</h2>
        <button onClick={onClose}>Close</button>
        <div>
          <p>ID: {hit.objectID}</p>
          <p>Title: {hit.name_en}</p>
          <p>Description: {hit.short_description_en}</p>
        </div>
      </Modal>
  );
}
