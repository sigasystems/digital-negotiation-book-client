import { useQuery } from "@tanstack/react-query";
import { businessOwnerService } from "@/modules/businessOwner/services/businessOwner";

export function useCheckUniqueFieldQuery(field, value) {
  const trimmedValue = value?.trim();

  const query = useQuery({
    queryKey: ["unique-field", field, trimmedValue],
    queryFn: async () => {
      if (!field || !trimmedValue) return null;
      const res = await businessOwnerService.checkUnique({ [field]: trimmedValue });
      return res?.data?.data?.[field];
    },
    enabled: Boolean(field && trimmedValue),  
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return query;
}
