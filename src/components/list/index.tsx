import { CSSProperties, useRef } from "react";
import { VariableSizeList } from "react-window";
import { useQuery } from "@tanstack/react-query";
import { getTopStories } from "../../api";
import Item from "../item";

const rowHeights: {
  [index: number]: number
} = {};

function setItemSize(index: number, height: number): void {
  rowHeights[index] = height || 30;
}

function getItemSize(index: number): number {
  return rowHeights[index] || 30;
}

function List() {
  const listRef = useRef<VariableSizeList>(null)
  const { data, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: getTopStories,
    refetchOnWindowFocus: false,
  });

  function ItemRenderer({
    style,
    index,
  }: {
    style: CSSProperties;
    index: number;
  }) {
    if (!data) return null;
    return <Item style={style} id={data[index]} index={index} setItemSize={setItemSize} listRef={listRef} />;
  }

  return (
    <>
      {isLoading && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>Loading...</span>
        </div>
      )}
      {data && (
        <VariableSizeList
          ref={listRef}
          itemCount={data.length}
          height={window.innerHeight}
          width="100%"
          itemSize={getItemSize}
        >
          {ItemRenderer}
        </VariableSizeList>
      )}
    </>
  );
}
export default List;
