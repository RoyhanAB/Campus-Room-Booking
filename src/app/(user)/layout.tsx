import { ClientLayout } from "@/component/client-layout";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <ClientLayout>{children}</ClientLayout>
  );
}