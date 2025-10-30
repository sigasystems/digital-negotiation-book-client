import { dashboardService } from "@/modules/dashboard/services/dashboardService";
import { businessOwnerService } from "@/modules/businessOwner/services/businessOwner";
import { productService } from "@/modules/product/services";

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

  // 🧩 Extract the API payload properly
  const apiData = response?.data?.data || {};

  // ✅ Extract buyers list and metadata safely
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
      const isProduct = typeof id === "object" ? id.type === "product" : false;
      const actualId = typeof id === "object" ? id.id : id;

      if (isProduct) {
        const res = await productService.deleteProduct(actualId);
        return res?.data || res;
      }

      const res = await businessOwnerService.deleteBuyer(actualId);
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
