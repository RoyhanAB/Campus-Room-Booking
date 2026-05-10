import { AdminLayout } from "@/component/admin_layout";
import { getSession } from "@/lib/auth";

export default async function Admin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <AdminLayout userName={session?.user_name}>
      {children}
    </AdminLayout>
  );
}