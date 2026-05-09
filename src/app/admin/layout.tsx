
import { AdminLayout } from "@/component/admin_layout";

export default function Admin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <AdminLayout>{children}</AdminLayout>
  );
}