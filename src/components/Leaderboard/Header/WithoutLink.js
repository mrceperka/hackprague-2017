import React from "react";

export default ({ board }) => {
  const imageUrl = board.img ? board.img : "/static/trophy.svg";
  const empty = !board.img ? " empty" : "";
  return (
    <div
      className={"top" + empty}
      style={{ backgroundImage: "url(" + imageUrl + ")" }}
    >
      <div className="overlay">
        <h3>
          {board.title}
        </h3>
        <p>
          {board.description}
        </p>
      </div>
    </div>
  );
};
