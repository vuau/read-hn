import { CSSProperties, useRef, useContext, useCallback } from "react";
import { VariableSizeList } from "react-window";
import { useQuery } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { BookmarksContext } from "../../AppNews";
import Item from "../item-news";
import { Dialog } from "@reach/dialog";
import ItemDetailNews from "../item-detail-news";
import { ArrowLeft } from "lucide-react";

interface RSSItem {
  title: string;
  url: string;
  id: string;
  site: string,
}

async function parseRSS(site: string, url: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(url, { mode: "no-cors" });
    const xml = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');
    
    const parsedItems: RSSItem[] = [];
    items.forEach(item => {
      parsedItems.push({
        title: item.querySelector('title')?.textContent || '',
        url: item.querySelector('link')?.textContent || '',
        id: item.querySelector('link')?.textContent || '',
        site
      });
    });
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

const feeds: Record<string, Array<[string, string]>>  = {
  "trang-chu": [
    ["vnexpress", "/vnexpress/rss/tin-moi-nhat.rss"],
    ["tuoitre", "/tuoitre/rss/tin-moi-nhat.rss"],
    ["thanhnien", "/thanhnien/rss/home.rss"],
  ],
  "thoi-su": [
    ["vnexpress", "/vnexpress/rss/thoi-su.rss"],
    ["tuoitre", "/tuoitre/rss/thoi-su.rss"],
    ["thanhnien", "/thanhnien/rss/thoi-su.rss"],
  ],
  "the-gioi": [
    ["vnexpress", "/vnexpress/rss/the-gioi.rss"],
    ["tuoitre", "/tuoitre/rss/the-gioi.rss"],
    ["thanhnien", "/thanhnien/rss/the-gioi.rss"],
  ],
  "kinh-te": [
    ["vnexpress", "/vnexpress/rss/kinh-doanh.rss"],
    ["tuoitre", "/tuoitre/rss/kinh-doanh.rss"],
    ["thanhnien", "/thanhnien/rss/kinh-te.rss"],
  ],
  "giao-duc": [
    ["vnexpress", "/vnexpress/rss/giao-duc.rss"],
    ["tuoitre", "/tuoitre/rss/giao-duc.rss"],
    ["thanhnien", "/thanhnien/rss/giao-duc.rss"],
  ],
  "giai-tri": [
    ["vnexpress", "/vnexpress/rss/giai-tri.rss"],
    ["tuoitre", "/tuoitre/rss/giai-tri.rss"],
    ["thanhnien", "/thanhnien/rss/giai-tri.rss"],
  ],
  "phap-luat": [
    ["vnexpress", "/vnexpress/rss/phap-luat.rss"],
    ["tuoitre", "/tuoitre/rss/phap-luat.rss"],
    ["thanhnien", "/thanhnien/rss/phap-luat.rss"],
  ],
  "doi-song": [
    ["vnexpress", "/vnexpress/rss/doi-song.rss"],
    ["tuoitre", "/tuoitre/rss/doi-song.rss"],
    ["thanhnien", "/thanhnien/rss/doi-song.rss"],
  ],
  "goc-nhin": [
    ["vnexpress", "/vnexpress/rss/goc-nhin.rss"],
    ["tuoitre", "/tuoitre/rss/ban-doc-lam-bao.rss"],
    ["thanhnien", "/thanhnien/rss/toi-viet.rss"],
  ],
  "tam-su": [
    ["vnexpress", "/vnexpress/rss/tam-su.rss"],
  ],
  "cong-nghe": [
    ["vnexpress", "/vnexpress/rss/so-hoa.rss"],
    ["tuoitre", "/tuoitre/rss/nhip-song-so.rss"],
    ["thanhnien", "/thanhnien/rss/cong-nghe-game.rss"],
  ]
};

function List() {
  const listRef = useRef<VariableSizeList>(null);
  const { bookmarks } = useContext(BookmarksContext);
  const navigate = useNavigate();
  const { tag } = useParams();
  const [ params ] = useSearchParams();
  const url = params.get('url');
  if (!tag) {
    navigate("/doc-bao/thoi-su");
  }
  const { data, isLoading } = useQuery({
    queryKey: ["stories", tag],
    queryFn: async () => {
      if (!tag) return [];
      if (tag === "bookmarked") return Promise.resolve(bookmarks);
      return Promise.all(feeds[tag].map(async ([site, feed]) => parseRSS(site, feed))).then(values => values.flat()); // Flatten array
    },
    refetchOnWindowFocus: false,
  });

  console.log({ data });

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
        index={index}
        setItemSize={setItemSize}
        listRef={listRef}
        data={data[index] as RSSItem}
      />
    );
  }

  const close = useCallback(() => {
    navigate(`/doc-bao/${tag}`);
  }, [navigate, tag]);

  return (
    <>
      <header>
        <nav>
          <NavLink to="/doc-bao/thoi-su">Thời sự</NavLink>
          <NavLink to="/doc-bao/the-gioi">Thế giới</NavLink>
          <NavLink to="/doc-bao/kinh-te">Kinh tế</NavLink>
          <NavLink to="/doc-bao/giao-duc">Giáo dục</NavLink>
          <NavLink to="/doc-bao/phap-luat">Pháp luật</NavLink>
          <NavLink to="/doc-bao/doi-song">Đời sống</NavLink>
          <NavLink to="/doc-bao/cong-nghe">Công nghệ</NavLink>
          <NavLink to="/doc-bao/giai-tri">Giải trí</NavLink>
          <NavLink to="/doc-bao/goc-nhin">Góc nhìn</NavLink>
          <NavLink to="/doc-bao/tam-su">Tâm sự</NavLink>
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
