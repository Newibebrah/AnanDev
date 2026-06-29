import Sidebar from "@/app/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main id="main-content" className="flex-1 p-4 md:p-8 bg-background">{children}</main>
    </div>
  );
}
