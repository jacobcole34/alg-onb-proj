import React, { useState } from 'react';

export function MyModal({ hit }) {
  // State to control the modal's visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="myModal">
      <button onClick={openModal}>Open Modal</button>

      {isModalOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <h1>MyModal</h1>
            <button onClick={closeModal} className="link-button">Close</button>
            <h1>{hit.title}</h1>
          </div>
        </div>
      )}
    </div>
  );
}
