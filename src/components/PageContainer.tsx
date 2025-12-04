import { ReactNode } from "react";
import Nav from "./Nav";
import HeadingBanner from "./HeadingBanner";
import Footer from "./Footer";

interface PageContainerProps {
  children: ReactNode;
  headingTitle?: string;
  headingSubtitle?: string;
  headingBackgroundImage?: string;
}

export default function PageContainer({
  children,
  headingTitle,
  headingSubtitle,
  headingBackgroundImage,
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Nav />

      {headingTitle && (
        <HeadingBanner
          title={headingTitle}
          subtitle={headingSubtitle}
          backgroundImage={headingBackgroundImage}
        />
      )}

      {children}

      <Footer />
    </div>
  );
}
