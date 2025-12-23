"use client";

import PasswordProtection from "@/components/PasswordProtection";
import PageContainer from "@/components/PageContainer";
import DateBooking from "@/components/DateBooking";

export default function BookPage() {
  return (
    <PasswordProtection pageName="book">
      <PageContainer
        headingTitle="Book Your Room"
        headingSubtitle="Reserve your revolutionary karaoke experience"
      >
        <main className="page-container">
          <div className="px-2 sm:px-4 py-8">
            <DateBooking />
          </div>
        </main>
      </PageContainer>
    </PasswordProtection>
  );
}
