"use client";

import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import StartupList from "@/components/StartupList";
import DetailView from "@/components/DetailView";
import MobileLayout from "@/components/MobileLayout";
import { industries, startups } from "@/data/sampleData";
import useIsMobile from "@/hooks/useIsMobile";

export default function IndustryPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const industryId = parseInt(params.industry as string);
  const selectedIndustry = industries.find(ind => ind.id === industryId);
  
  const filteredStartups = selectedIndustry?.startups || [];

  if (isMobile) {
    return <MobileLayout industries={industries} startups={startups} />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      <Sidebar
        industries={industries}
        selectedIndustryId={industryId}
        onSelectIndustry={(newIndustryId) => {
          if (newIndustryId) {
            router.push(`/${newIndustryId}`);
          } else {
            router.push('/');
          }
        }}
      />
      <StartupList
        startups={filteredStartups}
        selectedStartupId={null}
        onSelectStartup={(startupId) => router.push(`/${industryId}/${startupId}`)}
        selectedIndustryName={selectedIndustry?.name || null}
      />
      <DetailView startup={null} />
    </div>
  );
} 
