import '@/app/ui/global.css'; //imports global styles to app
import {inter} from '@/app/ui/fonts'; //import inter from fonts file

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*add inter font to body, antialiased smooths the font */}
      <body className={`${inter.className} antialiased`}>{children}</body> 
    </html>
  );
}
