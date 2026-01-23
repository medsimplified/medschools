"use client";

import { useCallback, useEffect, useState } from "react";

export type SubscriptionPlan = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number;
  durationLabel: string;
  features: string[];
  isPopular: boolean;
  isPublished: boolean;
  displayOrder: number;
  highlight: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type Scope = "published" | "all";

type UseSubscriptionPlansOptions = {
  scope?: Scope;
};

export function useSubscriptionPlans(options: UseSubscriptionPlansOptions = {}) {
  const { scope = "published" } = options;
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query = scope === "all" ? "?scope=all" : "";
      const response = await fetch(`/api/subscription-plans${query}`, {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to load plans");
      }

      const data = (await response.json()) as SubscriptionPlan[];
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load subscription plans", err);
      setPlans([]);
      setError(err instanceof Error ? err.message : "Failed to load plans");
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans,
  };
}
