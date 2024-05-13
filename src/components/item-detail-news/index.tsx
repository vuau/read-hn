import { useQuery } from "@tanstack/react-query";
import {
  getPageInReaderView,
} from "../../api";

import { useSearchParams } from "react-router-dom";
import { ArrowUpRightSquare, Loader } from "lucide-react";

function ItemDetail() {
  const [ params ] = useSearchParams();
  const url = params.get('url');

  const { data: articleData, isInitialLoading } = useQuery({
    queryKey: ["itemDetailArticle", url],
    queryFn: () => getPageInReaderView(url as string),
  });

    return (
      <div className="article-wrap">
        <h1>
           <a href={url as string} target="_blank">
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
                  __html: articleData as string,
                }}
              />
      </div>
    );
}

export default ItemDetail;
