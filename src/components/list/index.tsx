import { CSSProperties, useCallback, useRef, useContext } from "react";
import { VariableSizeList } from "react-window";
import { useQuery } from "@tanstack/react-query";
import { Tag, getStories } from "../../api";
import Item from "../item";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Dialog } from "@reach/dialog";
import { VisuallyHidden } from "@reach/visually-hidden";
import ItemDetail from "../item-detail";
import { ArrowLeft, Loader, Star, StarOff } from "lucide-react";
import { BookmarksContext } from "../../App";

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
  const { bookmarks, setBookmarks } = useContext(BookmarksContext);
  const navigate = useNavigate();
  const { id, tag } = useParams();
  if (!tag) {
    navigate("/posts/new");
  }
  const { data, isLoading } = useQuery({
    queryKey: ["stories", tag],
    queryFn: () => {
      if (!tag) return [];
      if (tag === "bookmarked") return Promise.resolve(bookmarks);
      return getStories(tag as Tag);
    },
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

  const bookmark = useCallback(() => {
    if (!id) return;
    setBookmarks((prev) => {
      if (prev.includes(+id)) {
        return prev.filter((i) => i !== +id);
      }
      return [...prev, +id];
    });
  }, [id, setBookmarks]);

  return (
    <>
      <header>
        <nav>
          <NavLink to="/posts/new">New</NavLink>
          <NavLink to="/posts/top">Top</NavLink>
          <NavLink to="/posts/best">Best</NavLink>
          <NavLink to="/posts/ask">Ask</NavLink>
          <NavLink to="/posts/show">Show</NavLink>
          <NavLink to="/posts/bookmarked">Bookmarked</NavLink>
        </nav>
      </header>
      {isLoading && (
        <div
          className="loader"
          style={{
            justifyContent: "center",
          }}
        >
          <Loader />
        </div>
      )}
      {data && (
        <VariableSizeList
          ref={listRef}
          itemCount={data.length}
          height={window.innerHeight - 60}
          width="100%"
          itemSize={getItemSize}
        >
          {ItemRenderer}
        </VariableSizeList>
      )}
      {id && (
        <Dialog isOpen onDismiss={close}>
          <div className="dialog-header">
            <button className="header-button" onClick={close}>
              <ArrowLeft />
              <span>Back</span>
            </button>
            <button className="header-button" onClick={bookmark}>
              {bookmarks.includes(+id) ? <StarOff /> : <Star />}
              <VisuallyHidden>Bookmark this page</VisuallyHidden>
            </button>
          </div>
          <ItemDetail />
        </Dialog>
      )}
    </>
  );
}
export default List;
