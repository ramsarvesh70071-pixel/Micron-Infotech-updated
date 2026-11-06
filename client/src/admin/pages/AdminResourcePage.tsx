import React from "react";
import { AdminLayout } from "../components/AdminLayout";
import { ResourceManager } from "../components/ResourceManager";
import { RESOURCE_DEFS } from "../resourceDefs";

/** One page component serves every content / lead collection; the config decides fields and columns. */
export default function AdminResourcePage({ resource }: { resource: string }) {
  const cfg = RESOURCE_DEFS[resource];
  if (!cfg) return null;
  return (
    <AdminLayout title={cfg.title} subtitle={cfg.subtitle}>
      <ResourceManager key={resource} def={cfg.def} />
    </AdminLayout>
  );
}
