import { AdminLayout } from "@/component/admin_layout";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Admin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'admin_fakultas' && session.role !== 'super_admin') {
    redirect('/');
  }

  return (
    <AdminLayout userName={session?.user_name} role={session?.role}>
      {children}
    </AdminLayout>
  );
}
