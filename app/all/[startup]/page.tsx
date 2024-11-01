"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import StartupList from "@/components/StartupList";
import DetailView from "@/components/DetailView";
import MobileLayout from "@/components/MobileLayout";
import { industries, startups } from "@/data/sampleData";
import useIsMobile from "@/hooks/useIsMobile";

export default function AllStartupsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const startupId = parseInt(params.startup as string);
  const selectedStartup = startups.find(s => s.id === startupId) || null;

  if (isMobile) {
    return <MobileLayout industries={industries} startups={startups} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
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
        selectedStartupId={startupId}
        onSelectStartup={(newStartupId) => router.push(`/all/${newStartupId}`)}
        selectedIndustryName="All Industries"
      />
      <DetailView startup={selectedStartup} />
    </div>
  );
} 
