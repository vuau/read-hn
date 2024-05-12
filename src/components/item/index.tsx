import { CSSProperties, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { VariableSizeList } from "react-window";
import { getItemDetail } from "../../api";
import { Link, useParams } from "react-router-dom";

type TListProps = {
  id: number;
  index: number;
  style: CSSProperties;
  setItemSize: (index: number, height: number) => void;
  listRef: React.RefObject<VariableSizeList>;
};

function ListItem({
  style: itemStyle,
  id,
  index,
  setItemSize,
  listRef,
}: TListProps) {
  const { tag = "top" } = useParams();

  const ref = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["itemDetail", id],
    queryFn: () => getItemDetail(id),
  });

  const combinedStyle = {
    ...itemStyle,
    opacity: data?.type === "job" ? 0.5 : 1,
  };

  useEffect(() => {
    if (ref.current && listRef?.current) {
      ref.current.style.height = "auto";
      setItemSize(index, ref.current.clientHeight);
      ref.current.style.height = `${ref.current.clientHeight}px`;
      listRef.current.resetAfterIndex(index);
    }
  }, [data, index, setItemSize, listRef]);

  if (isLoading) {
    return (
      <div className="item" style={combinedStyle}>
        {isLoading && (
          <div
            style={{ width: `${Math.random() * 50}%` }}
            className="loading-placeholder"
          />
        )}
      </div>
    );
  }
  if (data && (data.type === "story" || data.type === "job")) {
    return (
      <div ref={ref} style={combinedStyle} className="item">
        {data.type === "job" ? (
          <>
            <Link to={data.url} target="_blank">
              {data.title}
            </Link>
          </>
        ) : (
          <Link to={`/posts/${tag}/${id}`}>
            {data.title}
            <span className="comment-count">
              {data?.descendants || 0} comments
            </span>
          </Link>
        )}
      </div>
    );
  } else {
    console.log("sth wrong", data);
    return <div style={combinedStyle}>sth wrong</div>;
  }
}

export default ListItem;
