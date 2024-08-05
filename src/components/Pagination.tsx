import React, { useState, useEffect } from "react";
import { PaginationProps } from "../Models/PaginationProps";

const Pagination: React.FC<PaginationProps> = ({
  loadNextPage,
  loadPrevPage,
  loadPage,
  totalPages,
  currentPage,
}) => {
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  useEffect(() => {
    let numbers = [];
    for (let i = 1; i <= totalPages; i++) {
      numbers.push(i);
    }
    setPageNumbers(numbers);
  }, [totalPages]);

  return (
    <div className="pagination">
      <button onClick={loadPrevPage} disabled={currentPage === 1}>
        Prev
      </button>
      <ul>
        {pageNumbers.length === 0 ? (
          <li>No pages</li>
        ) : (
          pageNumbers.map((pageNumber) => (
            <li key={pageNumber}>
              <button
                onClick={() => loadPage(pageNumber)}
                className={currentPage === pageNumber ? "active" : ""}
              >
                {pageNumber}
              </button>
            </li>
          ))
        )}
      </ul>
      <button onClick={loadNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
