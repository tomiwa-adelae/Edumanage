import { useQuery } from "@tanstack/react-query";
import { configService } from "@/lib/configs";

// Query Keys
export const configKeys = {
  all: ["configs"] as const,
  category: (category: string) => [...configKeys.all, category] as const,
};

/**
 * Get config category data
 * @param category Category name (e.g., "SCHOOL_TYPE", "STATE", "COUNTRY")
 */
export function useConfigCategory(category: string | undefined) {
  return useQuery({
    queryKey: configKeys.category(category!),
    queryFn: () => configService.getCategory(category!),
    enabled: !!category,
    // Config data rarely changes, cache for 30 minutes
    staleTime: 30 * 60 * 1000,
    // Keep in cache for 1 hour
    gcTime: 60 * 60 * 1000,
  });
}

/**
 * Get multiple config categories at once
 * @param categories Array of category names
 */
export function useConfigCategories(categories: string[]) {
  return useQuery({
    queryKey: [...configKeys.all, ...categories.sort()],
    queryFn: async () => {
      const results = await Promise.all(
        categories.map((cat) => configService.getCategory(cat))
      );
      return categories.reduce((acc, cat, index) => {
        acc[cat] = results[index];
        return acc;
      }, {} as Record<string, any>);
    },
    enabled: categories.length > 0,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

// Commonly used configs
export function useStates() {
  return useConfigCategory("STATE");
}

export function useCountries() {
  return useConfigCategory("COUNTRY");
}

export function useSchoolTypes() {
  return useConfigCategory("SCHOOL_TYPE");
}

export function useOwnershipTypes() {
  return useConfigCategory("OWNERSHIP_TYPE");
}

export function useDepartments() {
  return useConfigCategory("SCHOOL_DEPARTMENT");
}

export function useClassLevels() {
  return useConfigCategory("CLASS_LEVEL");
}

export function useJobRoles() {
  return useConfigCategory("JOB_ROLE");
}
