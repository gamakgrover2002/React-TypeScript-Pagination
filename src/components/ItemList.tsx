import React from "react";
import { DataList } from "../Models/DataList";

interface ItemListProps {
  data: DataList;
}

const ItemList: React.FC<ItemListProps> = ({ data }) => {
  return (
    <ul className="item-list">
      {data.map((item) => (
        <li key={item.id} className="item-list-item">
          {item.title}
        </li>
      ))}
    </ul>
  );
};

export default ItemList;
