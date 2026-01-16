import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout only applies to routes under /app/admin/* (not /app/(auth)/admin/login)
  // The login page is in a route group, so it won't inherit this layout
  const session = await getSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-neutral-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
