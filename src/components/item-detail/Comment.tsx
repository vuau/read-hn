import { useQuery } from "@tanstack/react-query";
import { TItemDetailComment, getItemDetail } from "../../api";
import Pager from "../pager";

type TCommentProps = {
  data: number;
};

function Comment({ data: id }: TCommentProps) {
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
        <>
          <h3>
            {data.by}
            {parentData?.by && <div className="replied-to">Replied to: <strong>{parentData?.by}</strong></div>}
          </h3>
          <div
            dangerouslySetInnerHTML={{ __html: data.text }}
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
        </>
      )}
    </div>
  );
}
export default Comment;
