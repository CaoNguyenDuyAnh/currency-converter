import React from "react";
import "./Modal.css";

const Modal = ({ show, onClose, message, coinImages }) => {
  if (!show) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-content">
          {coinImages.map((coin, index) => (
            <img
              key={index}
              src={coin.src}
              alt="Coin"
              className="coin-animation"
              style={{
                animationDelay: `${coin.animationDelay}s`,
                left: `${coin.left}%`,
              }}
            />
          ))}
          <p>{message}</p>
          <button className="modal-close-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
