"use client";

import React, { useEffect } from "react";
import { observability } from "./observability";

export function ObservabilityProvider({
  serviceName,
  children,
}: {
  serviceName: string;
  children?: React.ReactNode;
}) {
  useEffect(() => {
    observability.init({ serviceName });
  }, [serviceName]);

  return <>{children}</>;
}
