import { ReactNode } from "react";
import Nav from "./Nav";
import HeadingBanner from "./HeadingBanner";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-red-50">
      <Nav />

      {headingTitle && (
        <HeadingBanner
          title={headingTitle}
          subtitle={headingSubtitle}
          backgroundImage={headingBackgroundImage}
        />
      )}

      {children}
    </div>
  );
}
