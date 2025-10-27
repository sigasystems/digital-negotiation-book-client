import { dashboardService } from "@/modules/dashboard/services/dashboardService";
import { businessOwnerService } from "@/modules/businessOwner/services/businessOwner";

export const roleBasedDataService = {
  async getDashboardData(role, params = {}) {
    const normalizedRole =
      typeof role === "object" && role?.userRole ? role.userRole : role;

    switch (normalizedRole) {
      case "super_admin": {
        const response = await dashboardService.getAllBusinessOwners(params);
        const data =
          response?.data?.data?.data ||
          response?.data?.data ||
          response?.businessOwners ||
          [];
        const total =
          response?.data?.totalItems ||
          response?.totalItems ||
          response?.total ||
          data.length;
        return { data, total };
      }

      case "business_owner": {
        const response = await businessOwnerService.getAllBuyers(params);
        const buyers =
          response?.data?.data?.data ||
          response?.buyers ||
          response?.data?.data ||
          [];
        const total =
          response?.data?.total ||
          response?.total ||
          response?.data?.buyers?.length ||
          buyers.length;
        return { data: buyers, total };
      }

      default:
        throw new Error(`Unsupported role: ${normalizedRole}`);
    }
  },

  async search(role, params = {}) {
    const normalizedRole =
      typeof role === "object" && role?.userRole ? role.userRole : role;

    switch (normalizedRole) {
      case "super_admin": {
        const response = await dashboardService.getAllBusinessOwners(params);
        const data = response?.data?.data || response?.data || [];
        const total =
          response?.data?.totalItems || response?.total || data.length;
        return { data, total };
      }

      case "business_owner": {
        const { ownerId, ...filters } = params;
        const response = await businessOwnerService.searchBuyers(
          ownerId,
          filters
        );
        const buyers =
          response?.data?.buyers || response?.data || response || [];
        const total =
          response?.data?.total || response?.total || buyers.length;
        return { data: buyers, total };
      }

      default:
        throw new Error(`Unsupported role: ${normalizedRole}`);
    }
  },

 getById: async (role, record) => {
    if (!record?.id) throw new Error("ID is required");

    const normalizedRole =
      typeof role === "object" && role?.userRole ? role.userRole : role;

    switch (normalizedRole) {
      case "super_admin": {
        // For super admin, just pass the id
        const response = await dashboardService.getBusinessOwnerById(record.id);
        return response?.data?.data || response?.data || response;
      }

      case "business_owner": {
        // For business_owner, need both ownerId and buyerId
        if (!record.ownerId) throw new Error("ownerId is required for business_owner");
        const response = await businessOwnerService.getBuyerById(record.id);
        return response?.data?.data?.buyer || response;
      }

      default:
        throw new Error(`Unsupported role: ${normalizedRole}`);
    }
  },

  async create(role, payload) {
  const normalizedRole =
    typeof role === "object" && role?.userRole ? role.userRole : role;

  switch (normalizedRole) {
    case "super_admin": {
      const res = await dashboardService.createBusinessOwner(payload);
      return res?.data || res;
    }

    case "business_owner": {
      const res = await businessOwnerService.addBuyer(payload);
      return res?.data || res;
    }

    default:
      throw new Error(`Unsupported role: ${normalizedRole}`);
  }
},

async update(role, id, payload) {
  const normalizedRole =
    typeof role === "object" && role?.userRole ? role.userRole : role;

  switch (normalizedRole) {
    case "super_admin": {
      const res = await dashboardService.updateBusinessOwner(id, payload);
      return res?.data || res;
    }

    case "business_owner": {
      const res = await businessOwnerService.updateBuyer(id.id, payload);
      return res?.data || res;
    }

    default:
      throw new Error(`Unsupported role: ${normalizedRole}`);
  }
},

async activate(role, id) {
  const normalizedRole =
    typeof role === "object" && role?.userRole ? role.userRole : role;

  switch (normalizedRole) {
    case "super_admin": {
      const res = await dashboardService.activateBusinessOwner(id);
      return res?.data || res;
    }

    case "business_owner": {
      const res = await businessOwnerService.activateBuyer?.(id);
      return res?.data || res;
    }

    default:
      throw new Error(`Unsupported role: ${normalizedRole}`);
  }
},

async deactivate(role, id) {
  const normalizedRole =
    typeof role === "object" && role?.userRole ? role.userRole : role;

  switch (normalizedRole) {
    case "super_admin": {
      const res = await dashboardService.deactivateBusinessOwner(id);
      return res?.data || res;
    }

    case "business_owner": {
      const res = await businessOwnerService.deactivateBuyer?.(id);
      return res?.data || res;
    }

    default:
      throw new Error(`Unsupported role: ${normalizedRole}`);
  }
},

async softDelete(role, id) {
  const normalizedRole =
    typeof role === "object" && role?.userRole ? role.userRole : role;

  switch (normalizedRole) {
    case "super_admin": {
      const res = await dashboardService.softDeleteBusinessOwner(id);
      return res?.data || res;
    }

    case "business_owner": {
      const res = await businessOwnerService.deleteBuyer(id);
      return res?.data || res;
    }

    default:
      throw new Error(`Unsupported role: ${normalizedRole}`);
  }
},

async review(role, id, payload) {
  const normalizedRole =
    typeof role === "object" && role?.userRole ? role.userRole : role;

  switch (normalizedRole) {
    case "super_admin": {
      const res = await dashboardService.reviewBusinessOwner(id, payload);
      return res?.data || res;
    }

    case "business_owner": {
      throw new Error("Review is only supported for super_admin");
    }

    default:
      throw new Error(`Unsupported role: ${normalizedRole}`);
  }
},
};
