import React from "react";

function Kategorie({ id, categorieName, handleCategoryChange, arrayCategorie }) {
  return (
      <div className="category">
        <input
          id={id}
          type="checkbox"
          name="cb"
          value={categorieName}
          onChange={handleCategoryChange}
          checked={arrayCategorie}
        />
        <label htmlFor={id}>{categorieName}</label>
      </div>
  );
}

export default Kategorie;
