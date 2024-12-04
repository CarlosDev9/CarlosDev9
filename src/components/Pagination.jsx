import React from "react";
import "../styles/Pagination.css";

function Pagination({ blogsPerPage, totalBlogs, paginate, currentPage }) {
  const pageNumbers = [];

  // Calcular el número total de páginas
  for (let i = 1; i <= Math.ceil(totalBlogs / blogsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <section>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${number === currentPage ? "active" : ""}`}
          >
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Pagination;
