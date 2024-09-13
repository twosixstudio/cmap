import { Navigation } from "./_components/navigation/navigation";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
