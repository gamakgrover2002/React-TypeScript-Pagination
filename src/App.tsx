// src/App.tsx
import React, { useState, useEffect } from "react";
import ItemList from "./components/ItemList";
import Pagination from "./components/Pagination";
import { Data } from "./Models/Data";
import FetchItems from "./api/fetchItems";
import { BaseAPI } from "./api/BaseAPI";

import "./style.css";

const App: React.FC = () => {
  const fetchItems = new FetchItems();
  const [limit, setLimit] = useState<number>(10);
  const [cache, setCache] = useState<Map<number, Data[]>>(new Map());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [data, setData] = useState<Data[]>([]);
  const [error, setError] = useState<string | null>(null);

  const totalData = BaseAPI.totalData;

  const loadNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const loadPrevPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const loadPage = (num: number) => {
    setCurrentPage(num);
  };

  const fetchData = async () => {
    if (currentPage >= totalPages && currentPage !== 1) {
      setCurrentPage(totalPages);
      return;
    }
    if (cache.has(currentPage)) {
      setData((cache.get(currentPage) as Data[]) || []);
    } else {
      const newData: Data[] = await fetchItems.fetchItems(
        (currentPage - 1) * limit,
        limit
      );
      setCache((prevCache) => new Map(prevCache).set(currentPage, newData));
      setData(newData);
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
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <ItemList
            cache={cache}
            currentPage={currentPage}
            loadNextPage={loadNextPage}
          />
          <Pagination
            loadNextPage={loadNextPage}
            loadPrevPage={loadPrevPage}
            loadPage={loadPage}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </>
      )}
    </div>
  );
};

export default App;
