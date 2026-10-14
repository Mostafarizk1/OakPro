import { notFound } from "next/navigation";
import { site } from "@/config/site";

// Hidden until real projects exist: flip site.features.projects in src/config/site.ts.
export default function Projects() {
  if (!site.features.projects) notFound();
  return null;
}
