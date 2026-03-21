"use client";

import ReelFeed from "@/components/reel-feed";
import { useParams } from "next/navigation";

export default function ReelPage() {
  const params = useParams();
  const reelId = params.reelId as string;

  return <ReelFeed initialReelId={reelId} />;
}
