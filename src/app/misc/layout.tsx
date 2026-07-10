import QueryProvider from "src/components/query-provider";

export default function MiscLayout({ children }: { children: React.ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
