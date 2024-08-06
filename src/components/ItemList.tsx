import React, { useState, useEffect, useCallback, useRef } from "react";
import { Data } from "../Models/Data";
import Pagination from "./Pagination";

interface ItemListProps {
  totalPages: number;
  cache: Map<number, Data[]>;
  currentPage: number;
  itemsPerPage: number; // Added itemsPerPage
  loadNextPage: () => void;
  loadPrevPage: () => void;
  setCurrentPage: (num: number) => void;
}

const ItemList: React.FC<ItemListProps> = ({
  totalPages,
  cache,
  currentPage,
  itemsPerPage,
  loadNextPage,
  loadPrevPage,
  setCurrentPage,
}) => {
  const [listData, setListData] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLUListElement>(null);
  const pageOffsets = useRef<number[]>([]); // Offsets for each page
  const previousScrollTop = useRef<number>(0); // To keep track of scroll position

  const handleScroll = useCallback(() => {
    if (loading || !containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Determine if we need to load the next or previous page
    if (scrollTop + containerHeight + 5 >= container.scrollHeight) {
      if (currentPage < totalPages && !loading) {
        setLoading(true);
        loadNextPage();
      }
    } else if (scrollTop <= 5) {
      if (currentPage > 1 && !loading) {
        setLoading(true);
        loadPrevPage();
      }
    }

    // Detect scroll position to change the page
    const currentOffset = pageOffsets.current.findIndex(
      (offset) => scrollTop < offset
    );
    if (currentOffset !== -1 && currentOffset + 1 !== currentPage) {
      setCurrentPage(currentOffset + 1);
    }
  }, [loading, loadNextPage, loadPrevPage, currentPage, totalPages]);

  useEffect(() => {
    // Save the current scroll position before the list is updated
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
    // Update listData when cache or currentPage changes
    const sortedCache = new Map(
      [...cache.entries()].sort((a, b) => a[0] - b[0])
    );
    const data: Data[] = [];
    sortedCache.forEach((value) => {
      data.push(...value);
    });
    setListData(data);

    // Calculate page offsets based on the rendered data
    if (containerRef.current) {
      const container = containerRef.current;
      const newPageOffsets: number[] = [];
      let accumulatedHeight = 0;

      for (let i = 0; i < data.length; i += itemsPerPage) {
        newPageOffsets.push(accumulatedHeight);
        accumulatedHeight += container.clientHeight; // Assumes each page is the height of the container
      }
      pageOffsets.current = newPageOffsets;
    }
  }, [cache, currentPage, itemsPerPage]);

  useEffect(() => {
    // Restore the previous scroll position after listData is updated
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: previousScrollTop.current,
        behavior: "smooth",
      });
    }
  }, [listData]);

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
