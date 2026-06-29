import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { getMessages, markMessageRead, deleteMessage, deleteAllMessages } from "@/app/actions/message.actions";
import { formatDate } from "@/app/lib/utils";
import { InlineAction } from "@/app/components/admin/inline-action";
import { DeleteAllButton } from "@/app/components/admin/delete-all-button";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Messages</h1>
        {messages.length > 0 && (
          <DeleteAllButton action={deleteAllMessages} label="Delete All" />
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-4 font-medium text-sm">From</th>
                  <th className="p-4 font-medium text-sm">Message</th>
                  <th className="p-4 font-medium text-sm hidden lg:table-cell">Date</th>
                  <th className="p-4 font-medium text-sm">Status</th>
                  <th className="p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-b last:border-0">
                    <td className="p-4">
                      <p className="font-medium">{message.name}</p>
                      <p className="text-xs text-muted-foreground">{message.email}</p>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="text-sm truncate">{message.content}</p>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="p-4">
                      <Badge variant={message.isRead ? "secondary" : "default"}>
                        {message.isRead ? "Read" : "New"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {!message.isRead && (
                          <InlineAction action={markMessageRead.bind(null, message.id)}>
                            <Button type="submit" variant="ghost" size="sm">
                              Mark Read
                            </Button>
                          </InlineAction>
                        )}
                        <InlineAction action={deleteMessage.bind(null, message.id)}>
                          <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                            Delete
                          </Button>
                        </InlineAction>
                      </div>
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No messages yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y">
            {messages.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">
                No messages yet.
              </p>
            )}
            {messages.map((message) => (
              <div key={message.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{message.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{message.email}</p>
                  </div>
                  <Badge variant={message.isRead ? "secondary" : "default"} className="shrink-0">
                    {message.isRead ? "Read" : "New"}
                  </Badge>
                </div>
                <p className="text-sm line-clamp-2">{message.content}</p>
                <p className="text-xs text-muted-foreground">{formatDate(message.createdAt)}</p>
                <div className="flex items-center gap-1">
                  {!message.isRead && (
                    <InlineAction action={markMessageRead.bind(null, message.id)}>
                      <Button type="submit" variant="ghost" size="sm">Mark Read</Button>
                    </InlineAction>
                  )}
                  <InlineAction action={deleteMessage.bind(null, message.id)}>
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
