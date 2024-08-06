import React, { useEffect, useRef } from "react";
export interface PaginationProps {
  loadNextPage: () => void;
  loadPrevPage: () => void;
  loadPage: (num: number) => void;
  totalPages: number;
  currentPage: number;
}
const Pagination: React.FC<PaginationProps> = ({
  loadNextPage,
  loadPrevPage,
  loadPage,
  totalPages,
  currentPage,
}) => {
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pagination = paginationRef.current;
    if (pagination) {
      const pageButtons = pagination.querySelectorAll("button");
      if (pageButtons.length > 0) {
        const currentButton = pageButtons[currentPage - 1];
        if (currentButton) {
          pagination.scrollTo({
            left:
              currentButton.offsetLeft -
              pagination.offsetWidth / 2 +
              currentButton.offsetWidth / 2,
            behavior: "smooth",
          });
        }
      }
    }
  }, [currentPage, totalPages]);

  return (
    <div className="pagination" ref={paginationRef}>
      <button onClick={loadPrevPage} disabled={currentPage === 1}>
        Prev
      </button>
      <ul>
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <li key={pageNumber + 1}>
            <button
              onClick={() => loadPage(pageNumber + 1)}
              className={currentPage === pageNumber + 1 ? "active" : ""}
            >
              {pageNumber + 1}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={loadNextPage} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};

export default Pagination;
