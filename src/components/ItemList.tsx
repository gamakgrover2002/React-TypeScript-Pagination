import React, { useState, useEffect, useCallback, useRef } from "react";
import { Data } from "../Models/Data";
import Pagination from "./Pagination";

interface ItemListProps {
  totalPages: number;
  cache: Map<number, Data[]>;
  currentPage: number;
  loadNextPage: () => void;
  setCurrentPage: (num: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({
  totalPages,
  cache,
  currentPage,
  loadNextPage,
  setCurrentPage,
}) => {
  const [listData, setListData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLUListElement>(null);
  const handleScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleScroll = useCallback(() => {
    if (loading || !containerRef.current) return;

    const container = containerRef.current;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    if (clientHeight + scrollTop + 5 >= scrollHeight) {
      setLoading(true);
      loadNextPage();
    }
  }, [loading, loadNextPage]);

  const debouncedHandleScroll = useCallback(() => {
    if (handleScrollTimeout.current) {
      clearTimeout(handleScrollTimeout.current);
    }
    handleScrollTimeout.current = setTimeout(() => {
      handleScroll();
    }, 500);
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", debouncedHandleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", debouncedHandleScroll);
      }
    };
  }, [debouncedHandleScroll]);

  useEffect(() => {
    const sortedCache = new Map(
      [...cache.entries()].sort((a, b) => a[0] - b[0])
    );
    const data: Data[] = [];
    sortedCache.forEach((value: any) => {
      data.push(...value);
    });
    setListData(data);

    if (containerRef.current) {
      const container = containerRef.current;
      const pageHeight = container.scrollHeight / sortedCache.size;
      const scrollToPosition = pageHeight * (currentPage - 1);
      container.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });
    }
  }, [cache, currentPage]);

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const pagination = document.getElementsByClassName("pagination");
    if (pagination.length > 0) {
      const scroll = (pagination[0].scrollWidth / totalPages) * currentPage;
      pagination[0].scrollTo({
        left: scroll,
        behavior: "smooth",
      });
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (containerRef.current) {
      console.log("Client Height:", containerRef.current.scrollTop);
    }
  }, [listData]);

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
