import { CSSProperties, useEffect, useRef } from "react";
import { VariableSizeList } from "react-window";
import { TItemDetailStory } from "../../api";
import { Link, useParams } from "react-router-dom";

type TListProps = {
  id: number;
  index: number;
  style: CSSProperties;
  setItemSize: (index: number, height: number) => void;
  listRef: React.RefObject<VariableSizeList>;
  data: TItemDetailStory;
};

function ListItem({
  style: itemStyle,
  id,
  index,
  setItemSize,
  listRef,
  data
}: TListProps) {
  const { tag = "top" } = useParams();

  const ref = useRef<HTMLDivElement>(null);

  const combinedStyle = {
    ...itemStyle,
  };

  useEffect(() => {
    if (ref.current && listRef?.current) {
      ref.current.style.height = "auto";
      setItemSize(index, ref.current.clientHeight);
      ref.current.style.height = `${ref.current.clientHeight}px`;
      listRef.current.resetAfterIndex(index);
    }
  }, [data, index, setItemSize, listRef]);

  if (data) {
    return (
      <div ref={ref} style={combinedStyle} className="item">
          <Link to={`/news/${tag}?url=${id}`}>
            {data.title}
          </Link>
      </div>
    );
  } else {
    console.log("sth wrong", data);
    return <div style={combinedStyle}>sth wrong</div>;
  }
}

export default ListItem;
