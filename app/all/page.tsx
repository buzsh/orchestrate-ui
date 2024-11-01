"use client";

import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import StartupList from "@/components/StartupList";
import DetailView from "@/components/DetailView";
import MobileLayout from "@/components/MobileLayout";
import { industries, startups } from "@/data/sampleData";
import useIsMobile from "@/hooks/useIsMobile";

export default function AllStartupsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileLayout industries={industries} startups={startups} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar
        industries={industries}
        selectedIndustryId={null}
        onSelectIndustry={(industryId) => {
          if (industryId) {
            router.push(`/${industryId}`);
          } else {
            router.push('/all');
          }
        }}
      />
      <StartupList
        startups={startups}
        selectedStartupId={null}
        onSelectStartup={(startupId) => router.push(`/all/${startupId}`)}
        selectedIndustryName="All Industries"
      />
      <DetailView startup={null} />
    </div>
  );
} 
