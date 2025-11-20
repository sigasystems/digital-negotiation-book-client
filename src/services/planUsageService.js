// src/services/planService.js
import apiClient from "@/utils/apiClient";

class PlanService {
  constructor() {
    this.usageCache = null;
  }

 
  async fetchUsage(userId, forceRefresh = false) {
    if (!userId) throw new Error("User ID is required");

    if (!forceRefresh && this.usageCache) return this.usageCache;

    try {
      const response = await apiClient.get(`/plans/plan-usage/${userId}`);
      this.usageCache = response.data.data; // store nested usage object
      return this.usageCache;
    } catch (error) {
      console.error("Error fetching plan usage:", error);
      throw error;
    }
  }

  /**
   * Get remaining credits for any feature
   * @param {string} feature - "buyers", "products", "offers", "locations"
   * @returns {number} remaining credits
   */
  getRemainingCredits(feature) {
    if (!this.usageCache) throw new Error("Usage data not loaded yet");
    if (!this.usageCache[feature]) throw new Error(`Feature "${feature}" not found`);

    // API already provides `remaining`, so we can just use it
    const remaining = this.usageCache[feature].remaining ?? 0;
    return Math.max(remaining, 0);
  }

  /**
   * Reset cached usage
   */
  resetCache() {
    this.usageCache = null;
  }
}

export default new PlanService();
