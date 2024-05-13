import { CSSProperties, useRef, useContext, useCallback } from "react";
import { VariableSizeList } from "react-window";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { BookmarksContext } from "../../AppNews";
import Item from "../item-news";
import { TItemDetailStory } from "api";
import { Dialog } from "@reach/dialog";
import ItemDetailNews from "../item-detail-news";
import { ArrowLeft } from "lucide-react";

interface RSSItem {
  title: string;
  url: string;
  id: string;
}

// Function to fetch and parse RSS feed
async function parseRSS(url: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(url);
    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const items = xmlDoc.querySelectorAll('item'); // Assuming 'item' is the tag for each feed item
    
    // Parse items
    const parsedItems: RSSItem[] = [];
    items.forEach(item => {
      parsedItems.push({
        title: item.querySelector('title')?.textContent || '',
        url: item.querySelector('link')?.textContent || '',
        id: item.querySelector('link')?.textContent || '',
      });
    });


    console.log({ xml, items, parsedItems });
    
    return parsedItems;
  } catch (error) {
    console.error('Error fetching or parsing RSS:', error);
    return [];
  }
}

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
  const { bookmarks } = useContext(BookmarksContext);
  const navigate = useNavigate();
  const { tag } = useParams();
  const [ params ] = useSearchParams();
  const url = params.get('url');
  if (!tag) {
    navigate("/news/tin-moi-nhat");
  }
  debugger; //eslint-disable-line
  const { data, isLoading } = useQuery({
    queryKey: ["stories", tag],
    queryFn: async () => {
      if (!tag) return [];
      if (tag === "bookmarked") return Promise.resolve(bookmarks);
      const items = await parseRSS("/vnexpress/rss/tin-moi-nhat.rss");
      return items;
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
        id={data[index].id}
        index={index}
        setItemSize={setItemSize}
        listRef={listRef}
        data={data[index] as TItemDetailStory}
      />
    );
  }

  const close = useCallback(() => {
    navigate(`/news/${tag}`);
  }, [navigate, tag]);

  return (
    <>
      <header>
        <nav>
          <NavLink to="/news/tin-moi-nhat">Tin moi nhat</NavLink>
          <NavLink to="/news/the-thao">The thao</NavLink>
          <NavLink to="/news/bookmarked">Bookmarked</NavLink>
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
      {url && (
        <Dialog isOpen onDismiss={close}>
          <div className="dialog-header">
            <button className="header-button" onClick={close}>
              <ArrowLeft />
              <span>Back</span>
            </button>
          </div>
          <ItemDetailNews />
        </Dialog>
      )}
    </>
  );
}
export default List;
