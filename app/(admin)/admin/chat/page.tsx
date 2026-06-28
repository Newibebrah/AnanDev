import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { getMessages, deleteChatMessage, deleteAllChatMessages } from "@/app/actions/chat.actions";
import { formatDate } from "@/app/lib/utils";
import { InlineAction } from "@/app/components/admin/inline-action";
import { DeleteAllButton } from "@/app/components/admin/delete-all-button";

export const dynamic = "force-dynamic";

export default async function AdminChatPage() {
  const messages = await getMessages();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Chat Messages</h1>
        {messages.length > 0 && (
          <DeleteAllButton action={deleteAllChatMessages} label="Delete All" />
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4 font-medium text-sm">Name</th>
                <th className="p-4 font-medium text-sm hidden md:table-cell">Message</th>
                <th className="p-4 font-medium text-sm hidden lg:table-cell">Date</th>
                <th className="p-4 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b last:border-0">
                  <td className="p-4">
                    <p className="font-medium">{msg.name}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell max-w-xs">
                    <p className="text-sm truncate">{msg.content}</p>
                  </td>
                  <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground">
                    {formatDate(msg.createdAt)}
                  </td>
                  <td className="p-4">
                    <InlineAction action={deleteChatMessage.bind(null, msg.id)}>
                      <Button type="submit" variant="ghost" size="sm" className="text-destructive">
                        Delete
                      </Button>
                    </InlineAction>
                  </td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    No messages yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
