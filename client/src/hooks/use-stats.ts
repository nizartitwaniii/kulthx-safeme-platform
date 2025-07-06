import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/api";

export function useStats() {
  return useQuery({
    queryKey: ["/api/stats"],
    queryFn: getStats,
    refetchInterval: 5000, // Poll every 5 seconds
  });
}
