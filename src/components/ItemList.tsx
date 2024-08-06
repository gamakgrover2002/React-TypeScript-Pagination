import React, { useState, useEffect, useCallback, useRef } from "react";
import { Data } from "../Models/Data";

interface ItemListProps {
  cache: Map<number, Data[]>;
  currentPage: number;
  loadNextPage: () => void;
  setCurrentPage: (num: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({
  cache,
  currentPage,
  loadNextPage,
  setCurrentPage,
}) => {
  const [listData, setListData] = useState<Data[]>([]);
  const [totalPagesRendered, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [rendered, setRendered] = useState<number[]>([]);
  const containerRef = useRef<HTMLUListElement>(null);

  const scrollPagination = (num: number): void => {
    const pageContainer = document.getElementsByClassName("pagination")[0];
    const sizebuttons = document.getElementsByTagName("li")[0].offsetWidth;
    const pageWidth = pageContainer.scrollWidth / 3;
    const scrollToPosition = pageWidth * num;
    pageContainer.scrollTo({
      left: scrollToPosition,
    });
  };

  const handleScroll = useCallback(() => {
    if (loading || !containerRef.current) return;

    const container = containerRef.current;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    if (clientHeight + scrollTop + 5 >= scrollHeight) {
      setLoading(true);
      loadNextPage();
      scrollPagination(currentPage + 1);
    }
  }, [loading, loadNextPage, currentPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    const sortedCache = new Map(
      [...cache.entries()].sort((a, b) => a[0] - b[0])
    );
    const data: Data[] = [];
    sortedCache.forEach((value) => {
      data.push(...value);
    });
    setListData(data);
    setTotalPages(sortedCache.size);

    if (!rendered.includes(currentPage)) {
      setRendered([...rendered, currentPage]);
    }

    if (containerRef.current) {
      const container = containerRef.current;
      const scrollHeight = container.scrollHeight;
      const scrollToPosition =
        (scrollHeight / totalPagesRendered) * (currentPage - 1);
      container.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });
    }
  }, [cache, currentPage, rendered, totalPagesRendered]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <ul className="item-list" ref={containerRef}>
      {listData.map((item) => (
        <li key={item.id} className="item-list-item">
          {item.title}
        </li>
      ))}
      {loading && <li>Loading...</li>}
    </ul>
  );
};

export default ItemList;
