"use client";

import { useParams } from "next/navigation";
import { TestRunner } from "@/components/test/TestRunner";
import { ReadingModifiedRunner } from "@/components/reading/ReadingModifiedRunner";
import { READING_MODIFIED_PREFIX } from "@/lib/reading-modified";

export default function ActivePracticePage() {
  const params = useParams<{ id: string }>();
  if (params.id.startsWith(READING_MODIFIED_PREFIX)) return <ReadingModifiedRunner practiceId={params.id} />;
  return <TestRunner kind="practice" testId={params.id} />;
}
