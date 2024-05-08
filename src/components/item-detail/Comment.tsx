import { useQuery } from "@tanstack/react-query";
import { TItemDetailComment, getItemDetail } from "../../api";
import Pager from "../pager";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@reach/disclosure";
import { useState } from "react";

type TCommentProps = {
  data: number;
};

function wrapWordsWithSpan(htmlContent: string): string | undefined {
  const doc = new DOMParser().parseFromString(htmlContent, 'text/html');

  function wrapWords(node: Node) {
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue !== null) {
      const words = node.nodeValue.split(/\s+/);
      const fragment = new DocumentFragment();
      words.forEach((word, index) => {
        if (index > 0) {
          fragment.appendChild(document.createTextNode(' '));
        }
        const span = document.createElement('span');
        span.appendChild(document.createTextNode(word));
        span.classList.add("lookup");
        fragment.appendChild(span);
      });
      node.parentNode?.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      for (const child of Array.from(node.childNodes)) {
        wrapWords(child as Node);
      }
    }
  }

  wrapWords(doc.body);

  // Use outerHTML to get the entire HTML content including the root element
  return doc.body.parentElement?.innerHTML;
}

function Comment({ data: id }: TCommentProps) {
  const [open, setOpen] = useState(true);
  const { data, isLoading } = useQuery({
    queryKey: ["itemDetail", id],
    queryFn: () => getItemDetail(id),
    refetchOnWindowFocus: false,
  });

  const parentId = (data as TItemDetailComment)?.parent;

  const { data: parentData } = useQuery({
    queryKey: ["itemDetail", parentId],
    queryFn: () => getItemDetail(parentId),
    refetchOnWindowFocus: false,
    enabled: !!parentId,
  });

  return (
    <div className="comment">
      {isLoading && <div>Loading comment...</div>}
      {data && data.type === "comment" && !data.deleted && (
        <Disclosure open={open} onChange={() => setOpen(!open)}>
          <DisclosureButton as="h3" className="comment-author">
            {data.by} <span className="collapse">[{open ? '-' : '+'}]</span>
            {parentData?.by && <div className="replied-to">Replied to: <strong>{parentData?.by}</strong></div>}
          </DisclosureButton>
          <DisclosurePanel>
            <div
              dangerouslySetInnerHTML={{ __html: wrapWordsWithSpan(data.text) || '' }}
            />
            {data &&
              data.type === "comment" &&
              !data.deleted &&
              data.kids?.length > 0 && (
                <div className="comment-child">
                  <Pager<number>
                    pageSize={10}
                    data={data.kids}
                    Component={Comment}
                  />
                </div>
              )}
          </DisclosurePanel>
        </Disclosure>
      )}
    </div>
  );
}
export default Comment;
