import "./globals.css";
import "flag-icons/css/flag-icons.min.css";

/**
 * Root layout is locale-agnostic and only owns global styles.
 * The document (<html>/<body>) is rendered by the locale layout, so providers that
 * inject elements into the document (e.g. next-themes) must live there instead.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
