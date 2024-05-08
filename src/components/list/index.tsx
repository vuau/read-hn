import { CSSProperties, useCallback, useRef } from "react";
import { VariableSizeList } from "react-window";
import { useQuery } from "@tanstack/react-query";
import { Tag, getStories } from "../../api";
import Item from "../item";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Dialog } from "@reach/dialog";
import { VisuallyHidden } from "@reach/visually-hidden";
import ItemDetail from "../item-detail";
import { ArrowLeft } from "lucide-react";

const rowHeights: {
  [index: number]: number;
} = {};

function setItemSize(index: number, height: number): void {
  rowHeights[index] = height || 30;
}

function getItemSize(index: number): number {
  return rowHeights[index] || 30;
}

function List() {
  const listRef = useRef<VariableSizeList>(null);
  const navigate = useNavigate();
  const { id, tag } = useParams();
  if (!tag) {
    navigate("/posts/new");
  }
  const { data, isLoading } = useQuery({
    queryKey: ["stories", tag],
    queryFn: () => getStories(tag as Tag),
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
    return (
      <Item
        style={style}
        id={data[index]}
        index={index}
        setItemSize={setItemSize}
        listRef={listRef}
      />
    );
  }

  const close = useCallback(() => {
    navigate(`/posts/${tag}`);
  }, [navigate, tag]);

  return (
    <>
      <header>
        <nav>
          <NavLink to="/posts/new">New</NavLink>
          <NavLink to="/posts/top">Top</NavLink>
          <NavLink to="/posts/best">Best</NavLink>
          <NavLink to="/posts/ask">Ask</NavLink>
          <NavLink to="/posts/show">Show</NavLink>
        </nav>
      </header>
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
          height={window.innerHeight - 40}
          width="100%"
          itemSize={getItemSize}
        >
          {ItemRenderer}
        </VariableSizeList>
      )}
      {id && (
        <Dialog isOpen onDismiss={close}>
          <button className="close-button" onClick={close}>
            <ArrowLeft />
            <VisuallyHidden>Back</VisuallyHidden>
            <span aria-hidden>Back</span>
          </button>
          <ItemDetail />
        </Dialog>
      )}
    </>
  );
}
export default List;
