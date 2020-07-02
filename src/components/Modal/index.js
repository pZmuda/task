import React from "react";

const Modal = ({ name, addName }) => {
  return (
    <div className="wrappModal">
      <div className="modal">
        <h1>Welcom</h1>
        <h2>What is your name?</h2>
        <input type="text" onChange={name} />
        <button className="button" onClick={addName}>
          {" "}
          Start
        </button>
      </div>
    </div>
  );
};

export default Modal;
