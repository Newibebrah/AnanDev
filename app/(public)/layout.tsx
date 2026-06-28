import Navbar from "@/app/components/public/Navbar";
import Footer from "@/app/components/public/Footer";
import { WebsiteStructuredData } from "@/app/components/seo/WebsiteStructuredData";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebsiteStructuredData />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
