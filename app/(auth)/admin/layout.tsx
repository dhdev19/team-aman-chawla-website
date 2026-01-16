// This layout is for the login page only
// It doesn't require authentication and doesn't include the admin sidebar
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
