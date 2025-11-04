import { businessOwnerService } from "@/modules/businessOwner/services/businessOwner";
import dashboardService from "@/modules/dashboard/services/dashboardService";

export const roleBasedDataService = {
  async getDashboardData(role, params = {}) {
    const normalizedRole =
      typeof role === "object" && role?.userRole ? role.userRole : role;

    switch (normalizedRole) {
      case "super_admin": {
  const response = await dashboardService.getAllBusinessOwners(params);

const apiData = response?.data?.data || {};
  const data = apiData?.data || [];
  const totalItems = apiData?.totalItems || 0;
  const totalPages = apiData?.totalPages || Math.ceil(totalItems / (params.pageSize || 10));
  const pageIndex = apiData?.pageIndex ?? params.pageIndex ?? 0;
  const pageSize = apiData?.pageSize ?? params.pageSize ?? 10;

  const totalActive = apiData?.totalActive ?? 0;
  const totalInactive = apiData?.totalInactive ?? 0;
  const totalDeleted = apiData?.totalDeleted ?? 0;

  return {
    data,
    totalItems,
    totalPages,
    pageIndex,
    pageSize,
    totalActive,
    totalInactive,
    totalDeleted,
  };
}


     case "business_owner": {
  const response = await businessOwnerService.getAllBuyers(params);

  const apiData = response?.data?.data || {};

  const buyers = apiData?.data || [];
  const totalItems = apiData?.totalItems || buyers.length;
  const totalPages = apiData?.totalPages || Math.ceil(totalItems / (params.pageSize || 10));
  const totalActive = apiData?.totalActive ?? 0;
  const totalInactive = apiData?.totalInactive ?? 0;
  const totalDeleted = apiData?.totalDeleted ?? 0;
  const pageIndex = apiData?.pageIndex ?? params.pageIndex ?? 0;
  const pageSize = apiData?.pageSize ?? params.pageSize ?? 10;

  return {
    data: buyers,
    totalItems,
    totalPages,
    totalActive,
    totalInactive,
    totalDeleted,
    pageIndex,
    pageSize,
  };
}

      default:
        throw new Error(`Unsupported role: ${normalizedRole}`);
    }
  },

  async search(role, params = {}) {
    const normalizedRole =
      typeof role === "object" && role?.userRole ? role.userRole : role;

    const { pageIndex = 0, pageSize = 10, ...filters } = params;

    switch (normalizedRole) {
      case "super_admin": {
        const queryParams = {};

        Object.entries(filters).forEach(([key, val]) => {
          if (val !== "" && val !== undefined) {
            queryParams[`params[${key}]`] = val;
          }
        });

        queryParams.page = pageIndex;
        queryParams.limit = pageSize;

        const response = await dashboardService.searchBusinessOwners(queryParams);

        const apiData = response?.data?.data || {};
        const businessOwners = apiData?.businessOwners || apiData?.data || [];
        const totalItems = apiData?.totalItems || businessOwners.length;
        const totalPages = apiData?.totalPages || Math.ceil(totalItems / pageSize);

        return {
          data: businessOwners,
          totalItems,
          totalPages,
          totalActive: apiData?.totalActive ?? 0,
          totalInactive: apiData?.totalInactive ?? 0,
          totalDeleted: apiData?.totalDeleted ?? 0,
          pageIndex,
          pageSize,
        };
      }

      case "business_owner": {
      const sessionUser = JSON.parse(sessionStorage.getItem("user"));
      const ownerId = sessionUser?.businessOwnerId || sessionUser?.id;

      if (!ownerId) throw new Error("Owner ID not found in session");

      const response = await businessOwnerService.searchBuyers(ownerId, {
        ...filters,
        page: pageIndex,
        limit: pageSize,
      });

      const apiData = response?.data?.data || {};
      const buyers = apiData?.buyers || apiData?.data || [];
      const totalItems = apiData?.totalItems || buyers.length;
      const totalPages =
        apiData?.totalPages || Math.ceil(totalItems / pageSize);
      const totalActive = apiData?.totalActive ?? 0;
      const totalInactive = apiData?.totalInactive ?? 0;
      const totalDeleted = apiData?.totalDeleted ?? 0;

      return {
        data: buyers,
        totalItems,
        totalPages,
        totalActive,
        totalInactive,
        totalDeleted,
        pageIndex,
        pageSize,
      };
      }

      default:
        throw new Error(`Unsupported role: ${normalizedRole}`);
    }
  },

  async getById(role, record) {
    if (!record?.id) throw new Error("ID is required");

    const normalizedRole =
      typeof role === "object" && role?.userRole ? role.userRole : role;

    switch (normalizedRole) {
      case "super_admin": {
        const response = await dashboardService.getBusinessOwnerById(record.id);
        return response?.data?.data || response?.data || response;
      }

      case "business_owner": {
      const type =
        record.type ||
        (record.productName ? "product" : "buyer");

      if (type === "buyer") {
        const response = await businessOwnerService.getBuyerById(record.id);
        return response?.data?.data || response?.data || response;
      }

      if (type === "product") {
        const response = await businessOwnerService.getProductById(record.id);
        return response?.data?.data || response?.data || response;
      }

      throw new Error(
        "Unsupported record type for business_owner. Expected 'buyer' or 'product'."
      );
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
      const res = await dashboardService.updateBusinessOwner(id.id, payload);
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
