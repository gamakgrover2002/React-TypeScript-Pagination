import React, { useState, useEffect, useCallback, useRef } from "react";
import { Data } from "../Models/Data";

interface ItemListProps {
  totalPages: number;
  cache: Map<number, Data[]>;
  currentPage: number;
  itemsPerPage: number;
  loadNextPage: () => void;
  loadPrevPage: () => void;
  setCurrentPage: (num: number) => void;
  IsPageChange: boolean;
  setPageChange: (bool: boolean) => void;
  limit: number;
}

const ItemList: React.FC<ItemListProps> = ({
  totalPages,
  cache,
  currentPage,
  itemsPerPage,
  loadNextPage,
  loadPrevPage,
  setCurrentPage,
  IsPageChange,
  setPageChange,
  limit,
}) => {
  const [listData, setListData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLUListElement>(null);
  const pageOffsets = useRef<number[]>([]);
  const previousScrollTop = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (loading || !containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    if (
      scrollTop + containerHeight + 5 >= container.scrollHeight &&
      currentPage < totalPages
    ) {
      setLoading(true);
      loadNextPage();
    }
    if (
      scrollTop + containerHeight - 5 >= container.scrollHeight &&
      currentPage < totalPages
    ) {
      console.log("run");
    }

    if (!IsPageChange) {
      const currentOffset = pageOffsets.current.findIndex(
        (offset) => scrollTop < offset
      );
      if (currentOffset !== -1 && currentOffset + 1 !== currentPage) {
        setCurrentPage(currentOffset + 1);
      }
    }
  }, [
    loading,
    loadNextPage,
    loadPrevPage,
    currentPage,
    totalPages,
    IsPageChange,
    setCurrentPage,
  ]);

  useEffect(() => {
    if (containerRef.current) {
      previousScrollTop.current = containerRef.current.scrollTop;
    }
  }, [listData]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    if (IsPageChange && containerRef.current) {
      if (limit > 0) {
        const idx = currentPage - 1;

        if (pageOffsets.current[idx] !== undefined) {
          containerRef.current.scrollTop = pageOffsets.current[idx];
        } else if (pageOffsets.current.length > 0) {
          containerRef.current.scrollTop =
            pageOffsets.current[pageOffsets.current.length - 1] + 200;
        }
      }
      setPageChange(false);
    }
  }, [currentPage, IsPageChange, limit]);

  useEffect(() => {
    const sortedCache = new Map(
      [...cache.entries()].sort((a, b) => a[0] - b[0])
    );
    const data: Data[] = [];
    sortedCache.forEach((value) => {
      data.push(...value);
    });
    setListData(data);
  }, [cache]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const newPageOffsets: number[] = [];
      let accumulatedHeight = 0;

      // Recalculate itemHeight based on the new limit
      const itemHeight = container.clientHeight / itemsPerPage;

      for (let i = 0; i < listData.length; i += itemsPerPage) {
        newPageOffsets.push(accumulatedHeight);
        accumulatedHeight += itemHeight * itemsPerPage;
      }
      pageOffsets.current = newPageOffsets;

      container.scrollTo({
        top: previousScrollTop.current,
      });
    }
  }, [listData, itemsPerPage, limit]);

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
