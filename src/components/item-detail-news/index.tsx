import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getPageInReaderView,
} from "../../api";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@reach/disclosure";

import { useParams, useSearchParams } from "react-router-dom";
import { ArrowUpRightSquare, Loader } from "lucide-react";

function ItemDetail() {
  const [ params ] = useSearchParams();
  const url = params.get('url');


  const [openArticle, setOpenArticle] = useState(true);
  const [showFullHeight, setShowFullHeight] = useState(false);

  const { data: articleData, isInitialLoading } = useQuery({
    queryKey: ["itemDetailArticle", url],
    queryFn: () => getPageInReaderView(url as string),
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

    return (
      <div className="article-wrap">
        <h1>
           <a href={url} target="_blank">
              {url} <ArrowUpRightSquare />
           </a>
        </h1>
        {isInitialLoading && (
          <div className="loader">
            Parsing content...
            <Loader />
          </div>
        )}
              <div
                className="article"
                dangerouslySetInnerHTML={{
                  __html: articleData,
                }}
              />
      </div>
    );
}

export default ItemDetail;
