import { ClientLayout } from "@/component/client-layout";
import { getSession } from "@/lib/auth";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <ClientLayout userName={session?.user_name}>
      {children}
    </ClientLayout>
  );
}