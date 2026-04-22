import { Suspense } from "react";
import { PostMatchPage } from "@/components/staff/PostMatchPage";

export default function PostMatch() { 
  return (
    <Suspense fallback={<div className="p-10 text-white">Chargement du rapport...</div>}>
      <PostMatchPage />
    </Suspense>
  ); 
}
