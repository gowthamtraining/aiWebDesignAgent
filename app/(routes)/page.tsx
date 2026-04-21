import { Suspense } from "react";
import ChartInterface from "@/components/Chat";

export default function Home() {
  return (
    <Suspense>
      <ChartInterface />
    </Suspense>
  );
}
