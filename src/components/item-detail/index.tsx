import { CSSProperties, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getItemDetail,
  getPageInReaderView,
  TItemDetailStory,
} from "../../api";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@reach/disclosure";

import Comment from "./Comment";
import Pager from "../pager";
import { useParams } from "react-router-dom";
import { ArrowUpRightSquare, Loader } from "lucide-react";

function ItemDetail() {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["itemDetail", id],
    queryFn: () => getItemDetail(Number(id)),
  });

  const [openArticle, setOpenArticle] = useState(true);
  const [showFullHeight, setShowFullHeight] = useState(false);
  const combinedStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "10px 0",
    opacity: data?.type === "job" ? 0.5 : 1,
  };

  const { data: articleData, isInitialLoading } = useQuery({
    queryKey: ["itemDetailArticle", id],
    queryFn: () => getPageInReaderView((data as TItemDetailStory).url),
    enabled: Boolean(data) && Boolean((data as TItemDetailStory).url),
  });

  const initialHeight =
    window.innerHeight / 1.5 -
    80 -
    (document.querySelector("#articleTitle")?.getBoundingClientRect()?.height ||
      0);

  const hideArticle = useCallback(() => {
    setOpenArticle(false);
    document.querySelectorAll(".comment")[0].scrollIntoView();
  }, []);

  if (isLoading) {
    return (
      <div style={combinedStyle}>
        {isLoading && (
          <div className="loader">
            <Loader />
          </div>
        )}
      </div>
    );
  }
  if (data && (data.type === "story" || data.type === "job")) {
    return (
      <div className="article-wrap">
        <h1>
          {data?.url ? (
            <a href={data?.url} target="_blank">
              {data?.title} <ArrowUpRightSquare />
            </a>
          ) : (
            data?.title
          )}
        </h1>
        {isInitialLoading && (
          <div className="loader">
            Parsing content...
            <Loader />
          </div>
        )}
        {articleData && (
          <Disclosure open={openArticle}>
            <DisclosurePanel>
              <div
                className="article"
                style={{
                  height: showFullHeight ? "auto" : `${initialHeight}px`,
                }}
                dangerouslySetInnerHTML={{
                  __html: articleData,
                }}
              />
            </DisclosurePanel>
            <div className="article-buttons">
              {openArticle ? (
                <>
                  {!showFullHeight && (
                    <DisclosureButton onClick={() => setShowFullHeight(true)}>
                      Expand
                    </DisclosureButton>
                  )}
                  <DisclosureButton onClick={hideArticle}>
                    Hide
                  </DisclosureButton>
                </>
              ) : (
                <DisclosureButton onClick={() => setOpenArticle(true)}>
                  Show
                </DisclosureButton>
              )}
            </div>
          </Disclosure>
        )}
        {data?.kids?.length > 0 && (
          <Pager<number> pageSize={10} data={data.kids} Component={Comment} />
        )}
      </div>
    );
  } else {
    console.log("sth wrong", data);
    return <div style={combinedStyle}>sth wrong</div>;
  }
}

export default ItemDetail;
