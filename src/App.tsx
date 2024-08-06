// src/App.tsx
import React, { useState, useEffect } from "react";
import ItemList from "./components/ItemList";
import Pagination from "./components/Pagination";
import { DataList } from "./Models/DataList";
import FetchItems from "./api/fetchItems";
import { BaseAPI } from "./api/BaseAPI";

import "./style.css";

const App: React.FC = () => {
  const fetchItems = new FetchItems();
  const [limit, setLimit] = useState<number>(10);
  const [cache, setCache] = useState<Map<number, DataList>>(new Map());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [data, setData] = useState<DataList>([]);

  const totalData = BaseAPI.totalData;

  const loadNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const loadPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const loadPage = (num: number) => {
    setCurrentPage(num);
  };

  const fetchData = async () => {
    try {
      if (cache.has(currentPage)) {
        setData(cache.get(currentPage) || []);
      } else {
        const newData: DataList = await fetchItems.fetchItems(
          (currentPage - 1) * limit,
          limit
        );
        setCache((prevCache) => new Map(prevCache).set(currentPage, newData));
        setData(newData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, limit]);

  useEffect(() => {
    if (totalData > 0 && limit > 0) {
      setTotalPages(Math.ceil(totalData / limit));
    }
  }, [totalData, limit]);

  return (
    <div className="main-page">
      <ItemList cache={cache} currentPage={currentPage} />
      <Pagination
        loadNextPage={loadNextPage}
        loadPrevPage={loadPrevPage}
        loadPage={loadPage}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </div>
  );
};

export default App;
