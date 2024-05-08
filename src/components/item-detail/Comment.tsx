import { useQuery } from "@tanstack/react-query";
import { TItemDetailComment, getItemDetail } from "../../api";
import Pager from "../pager";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@reach/disclosure";
import { useState } from "react";

type TCommentProps = {
  data: number;
};

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
              dangerouslySetInnerHTML={{ __html: data.text }}
              onDoubleClick={() => setOpen(!open)}
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
