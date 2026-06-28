import { prisma } from "@/app/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [projectCount, postCount, commentCount, messageCount, errorLogCount] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.comment.count(),
    prisma.message.count(),
    prisma.errorLog.count(),
  ]);

  const unreadMessages = await prisma.message.count({ where: { isRead: false } });
  const pendingComments = await prisma.comment.count({ where: { isApproved: false } });
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
  const recentErrors = await prisma.errorLog.count({
    where: { level: "error", createdAt: { gte: twentyFourHoursAgo } },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{projectCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{postCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{commentCount}</p>
            {pendingComments > 0 && (
              <p className="text-sm text-destructive mt-1">
                {pendingComments} pending approval
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{messageCount}</p>
            {unreadMessages > 0 && (
              <p className="text-sm text-destructive mt-1">
                {unreadMessages} unread
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Error Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{errorLogCount}</p>
            {recentErrors > 0 && (
              <p className="text-sm text-destructive mt-1">
                {recentErrors} in last 24h
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
