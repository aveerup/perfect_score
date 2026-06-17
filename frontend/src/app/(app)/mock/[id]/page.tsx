"use client";

import { useParams } from "next/navigation";
import { TestRunner } from "@/components/test/TestRunner";

export default function ActiveMockPage() {
  const params = useParams<{ id: string }>();
  return <TestRunner kind="mock" testId={params.id} />;
}
