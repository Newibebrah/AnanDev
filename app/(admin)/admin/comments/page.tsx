import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { getComments, approveComment, rejectComment, deleteComment, deleteAllComments } from "@/app/actions/comment.actions";
import { formatDate } from "@/app/lib/utils";
import { InlineAction } from "@/app/components/admin/inline-action";
import { DeleteAllButton } from "@/app/components/admin/delete-all-button";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const comments = await getComments();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Comments</h1>
        {comments.length > 0 && (
          <DeleteAllButton action={deleteAllComments} label="Delete All" />
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-4 font-medium text-sm">Author</th>
                  <th className="p-4 font-medium text-sm">Comment</th>
                  <th className="p-4 font-medium text-sm hidden lg:table-cell">Post</th>
                  <th className="p-4 font-medium text-sm hidden lg:table-cell">Date</th>
                  <th className="p-4 font-medium text-sm">Status</th>
                  <th className="p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id} className="border-b last:border-0">
                    <td className="p-4">
                      <p className="font-medium">{comment.name}</p>
                      {comment.email && (
                        <p className="text-xs text-muted-foreground">{comment.email}</p>
                      )}
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-sm truncate">{comment.content}</p>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                      {comment.post?.title}
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="p-4">
                      <Badge variant={comment.isApproved ? "default" : "secondary"}>
                        {comment.isApproved ? "Approved" : "Pending"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {!comment.isApproved && (
                          <InlineAction action={approveComment.bind(null, comment.id)}>
                            <Button type="submit" variant="ghost" size="sm">
                              Approve
                            </Button>
                          </InlineAction>
                        )}
                        {comment.isApproved && (
                          <InlineAction action={rejectComment.bind(null, comment.id)}>
                            <Button type="submit" variant="ghost" size="sm">
                              Reject
                            </Button>
                          </InlineAction>
                        )}
                        <InlineAction action={deleteComment.bind(null, comment.id)}>
                          <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                            Delete
                          </Button>
                        </InlineAction>
                      </div>
                    </td>
                  </tr>
                ))}
                {comments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No comments yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y">
            {comments.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">
                No comments yet.
              </p>
            )}
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{comment.name}</p>
                    {comment.email && (
                      <p className="text-xs text-muted-foreground truncate">{comment.email}</p>
                    )}
                  </div>
                  <Badge variant={comment.isApproved ? "default" : "secondary"} className="shrink-0">
                    {comment.isApproved ? "Approved" : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm line-clamp-2">{comment.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{comment.post?.title || "Unknown post"}</span>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  {!comment.isApproved && (
                    <InlineAction action={approveComment.bind(null, comment.id)}>
                      <Button type="submit" variant="ghost" size="sm">Approve</Button>
                    </InlineAction>
                  )}
                  {comment.isApproved && (
                    <InlineAction action={rejectComment.bind(null, comment.id)}>
                      <Button type="submit" variant="ghost" size="sm">Reject</Button>
                    </InlineAction>
                  )}
                  <InlineAction action={deleteComment.bind(null, comment.id)}>
                    <Button type="submit" variant="ghost" size="sm" className="text-destructive">Delete</Button>
                  </InlineAction>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
