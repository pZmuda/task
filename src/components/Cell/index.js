import React from "react";

const Cell = (props) => {
  let cell = () => {
    if (props.data.isOpen) {
      if (props.data.treasure) {
        return (
          <div className="cell open" onClick={() => props.open(props.data)}>
            <span>
              <i className="icon ion-android-radio-button-on"></i>
            </span>
          </div>
        );
      } else if (props.data.count === 0) {
        return (
          <div className="cell open" onClick={() => props.open(props.data)} />
        );
      } else {
        return (
          <div className="cell open" onClick={() => props.open(props.data)}>
            {props.data.count}
          </div>
        );
      }
    } else {
      return <div className="cell" onClick={() => props.open(props.data)} />;
    }
  };
  return cell();
};

export default Cell;
