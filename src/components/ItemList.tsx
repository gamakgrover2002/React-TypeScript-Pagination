import React, { useState, useEffect } from "react";
import { DataList } from "../Models/DataList";

interface ItemListProps {
  cache: Map<number, DataList>;
  currentPage: number;
}

const ItemList: React.FC<ItemListProps> = ({ cache, currentPage }) => {
  const [listData, setListData] = useState<DataList>([]);
  const [total, setTotal] = useState(1);

  useEffect(() => {
    const data: DataList = [];
    const sortedCache = new Map(
      [...cache.entries()].sort((a, b) => a[0] - b[0])
    );
    sortedCache.forEach((value) => {
      data.push(...value);
    });
    setListData(data);
    setTotal(sortedCache.size);
  }, [cache, currentPage]);

  useEffect(() => {
    const container: Element = document.getElementsByClassName("item-list")[0];
    const x: number = container.scrollHeight;
    console.log(currentPage * (x / total));
  }, [currentPage, total]);

  return (
    <ul className="item-list">
      {listData.map((item) => (
        <li key={item.id} className="item-list-item">
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default ItemList;
