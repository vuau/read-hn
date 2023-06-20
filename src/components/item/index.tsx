import { CSSProperties, useCallback, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { VariableSizeList } from "react-window";
import { getItemDetail } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dialog } from "@reach/dialog";
import { VisuallyHidden } from "@reach/visually-hidden";
import ItemDetail from "../item-detail";
import { ArrowLeft } from "lucide-react";

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
  const { id: idInParam } = useParams();
  const navigate = useNavigate();

  const close = useCallback(() => {
    navigate('/');
  }, [navigate]);

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
    return <div className="item" style={combinedStyle}>{isLoading && "Loading..."}</div>;
  }
  if (data && (data.type === "story" || data.type === "job")) {
    return (
      <div ref={ref} style={combinedStyle} className="item">
        {data.type === "job" ? (
          <>
            <span className="badge">
              Job
            </span>
            <Link to={data.url} target="_blank">
              {data.title}
            </Link>
          </>
        ) : (
          <Link to={`/posts/${id}`}>
            {data.title}
            <span className="comment-count">
              {data?.descendants || 0} comments
            </span>
          </Link>
        )}
        {idInParam === String(id) && (
          <Dialog isOpen onDismiss={close}>
            <button className="close-button" onClick={close}>
              <ArrowLeft />
              <VisuallyHidden>Back</VisuallyHidden>
              <span aria-hidden>Back</span>
            </button>
            <ItemDetail />
          </Dialog>
        )}
      </div>
    );
  } else {
    console.log("sth wrong", data);
    return <div style={combinedStyle}>sth wrong</div>;
  }
}

export default ListItem;
