import "./globals.css";
import "flag-icons/css/flag-icons.min.css";

// Root stays locale-agnostic; the locale layout owns <html>/<body> for document-level providers
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
