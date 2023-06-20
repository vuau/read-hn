import { useState } from "react";

type TLoaderProps<ItemData> = {
  data: ItemData[];
  Component: React.FC<{ data: ItemData }>;
  pageSize: number;
};

function chunkArray<ItemData>(array: ItemData[], chunkSize: number) {
  const chunkedArray: ItemData[][] = [];
  let index = 0;
  while (index < array.length) {
    chunkedArray.push(array.slice(index, index + chunkSize));
    index += chunkSize;
  }
  return chunkedArray;
}

function Pager<ItemData>({
  data,
  Component,
  pageSize,
}: TLoaderProps<ItemData>): JSX.Element {
  const chunkedData: ItemData[][] = chunkArray(data, pageSize);
  const [numOfPages, setNumOfPages] = useState(1);

  return (
    <>
      {chunkedData
        .slice(0, numOfPages)
        .map((arr, x) =>
          arr.map((itemData, y) => (
            <Component key={`${x}-${y}`} data={itemData} />
          ))
        )}
      {numOfPages < chunkedData.length && (
        <button onClick={() => setNumOfPages((numOfPages) => numOfPages + 1)}>
          Load more
        </button>
      )}
    </>
  );
}

export default Pager;
