import React, { useState, useEffect, useCallback } from "react";
import { DataList } from "../Models/DataList";

interface ItemListProps {
  cache: Map<number, DataList>;
  currentPage: number;
  loadNextPage: () => void;
}

const ItemList: React.FC<ItemListProps> = ({
  cache,
  currentPage,
  loadNextPage,
}) => {
  const [listData, setListData] = useState<DataList[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleScroll = useCallback(() => {
    const container = document.getElementsByClassName(
      "item-list"
    )[0] as HTMLElement;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    const scrollTop = container.scrollTop;

    if (clientHeight + scrollTop + 5 >= scrollHeight) {
      loadNextPage();
    }
  }, [loadNextPage]);

  useEffect(() => {
    const data: DataList[] = [];
    const sortedCache = new Map(
      [...cache.entries()].sort((a, b) => a[0] - b[0])
    );
    sortedCache.forEach((value) => {
      data.push(...value);
    });
    setListData(data);
    setTotalPages(sortedCache.size);
  }, [cache]);

  useEffect(() => {
    const container = document.getElementsByClassName(
      "item-list"
    )[0] as HTMLElement;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (loading) {
      const container = document.getElementsByClassName(
        "item-list"
      )[0] as HTMLElement;

      const handleDataLoaded = () => setLoading(false);

      container.addEventListener("dataLoaded", handleDataLoaded);

      return () => {
        container.removeEventListener("dataLoaded", handleDataLoaded);
      };
    }
  }, [loading]);

  useEffect(() => {
    const container = document.getElementsByClassName(
      "item-list"
    )[0] as HTMLElement;
  }, [currentPage, totalPages]);

  return (
    <ul className="item-list">
      {listData.map((item, index) => (
        <li key={`${item.id}-${index}`} className="item-list-item">
          {item.title}
        </li>
      ))}
      {loading && <li>Loading...</li>}
    </ul>
  );
};

export default ItemList;
