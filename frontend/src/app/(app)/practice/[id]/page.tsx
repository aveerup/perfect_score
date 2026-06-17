"use client";

import { useParams } from "next/navigation";
import { TestRunner } from "@/components/test/TestRunner";

export default function ActivePracticePage() {
  const params = useParams<{ id: string }>();
  return <TestRunner kind="practice" testId={params.id} />;
}
