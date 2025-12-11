import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  UserCircle2,
  MapPin,
  ArrowLeft,
  Save,
  Package,
  ChevronDown,
} from "lucide-react";
import { businessOwnerService } from "../services/businessOwner";
import { useToast } from "@/app/hooks/useToast";
import { validateBuyer } from "@/app/config/buyerValidation";
import { BUYER_FORM_FIELDS } from "@/app/config/buyerFormConfig";
import planUsageService from "@/services/planUsageService";
import { Toast } from "@/components/common/Toast";
import { Spinner } from "@/components/ui/spinner";
import { productService } from "@/modules/product/services";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AddBuyerForm() {
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");
  const [remainingBuyers, setRemainingBuyers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { toasts, showToast } = useToast();
  const navigate = useNavigate();

  const initialData = {
    ownerId: user?.businessOwnerId || "",
    buyersCompanyName: "",
    registrationNumber: "",
    taxId: "",
    contactName: "",
    contactEmail: "",
    countryCode: "",
    contactPhone: "",
    country: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
    productName: "",
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductsLoading(true);
        const productsResponse = await productService.getAllProducts(1, 100);
        if (productsResponse?.data?.data?.products) {
          setProducts(productsResponse.data.data.products);
        }
        setProductsLoading(false);

        await planUsageService.fetchUsage(user.id);
        const remaining = planUsageService.getRemainingCredits("buyers");
        setRemainingBuyers(remaining);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        showToast("error", "Failed to load required data.");
        setProductsLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const updateField = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData({ ...formData, productName: product.productName });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const error = validateBuyer(formData);
    if (error) return showToast("error", error);
    
    if (!formData.productName) {
      return showToast("error", "Please select a product");
    }
    
    setIsConfirmOpen(true);
  };

  const confirmSubmit = async () => {
    setIsConfirmOpen(false);
    setLoading(true);

    try {
      const res = await businessOwnerService.addBuyer(formData);

      if (res?.status === 201) {
        showToast("success", "Buyer added successfully!");
        setFormData(initialData);
        setSelectedProduct(null);
        setTimeout(() => navigate("/users"), 1000);
      } else {
        showToast("error", res?.message || "Failed to add buyer");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to add buyer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50 px-[24.5px]">
      {loading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Spinner className="w-8 h-8 text-indigo-600 mb-3" />
          <p className="text-slate-700 font-medium">Adding buyer...</p>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Confirm Buyer Creation
              </h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-slate-600">
                Are you sure you want to add this buyer?
              </p>
              {selectedProduct && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Selected Product:
                  </p>
                  <p className="text-sm text-slate-900 font-semibold">
                    {selectedProduct.productName}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition"
              >
                Confirm & Add Buyer
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-40 space-y-2">
        {toasts.map((t) => (
          <Toast key={t.id} type={t.type} message={t.message} />
        ))}
      </div>

      <header className="sticky top-0 bg-white border-b border-slate-200 shadow-sm z-20 rounded-xl">
        <div className="mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer inline-flex items-center text-slate-700 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </button>
            <div className="h-8 w-px bg-slate-300 hidden sm:block" />
            <div className="flex items-center gap-3 ml-3">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  Add Buyer
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Create new buyer entry
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto py-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 px-9 pt-4 font-bold">
              {remainingBuyers > 0 ? (
                <>
                  <span className="text-[#16a34a] text-lg">
                    Remaining Credits:
                  </span>

                  <span className="text-[#16a34a] text-lg">
                    {remainingBuyers}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[#16a34a] text-lg">
                    Remaining Credits:
                  </span>
                  <span className="text-red-700 text-lg">
                    Plan limit for adding buyer is exceeded...
                  </span>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Information */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-[#16a34a]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Company Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Basic details about the buyer's company
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {BUYER_FORM_FIELDS.company.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-rose-500">*</span>
                        )}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        placeholder={field.placeholder || field.label}
                        value={formData[field.name]}
                        onChange={updateField}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <UserCircle2 className="w-5 h-5 text-[#16a34a]" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Contact Information
                    </h2>
                    <p className="text-sm text-slate-500">
                      Primary contact details for communication
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {BUYER_FORM_FIELDS.contact.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-rose-500">*</span>
                        )}
                      </label>
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        placeholder={field.placeholder || field.label}
                        value={formData[field.name]}
                        onChange={updateField}
                        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Product Selection
                    </h2>
                    <p className="text-sm text-slate-500">
                      Select the product associated with this buyer
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Select Product <span className="text-rose-500">*</span>
                  </label>
                  
                  {productsLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Spinner className="w-5 h-5 text-[#16a34a]" />
                      <span className="ml-3 text-slate-600">Loading products...</span>
                    </div>
                  ) : (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="w-full flex items-center justify-between px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white hover:bg-slate-50 text-left"
                          >
                            <span className={`${!selectedProduct ? 'text-slate-400' : 'text-slate-900'}`}>
                              {selectedProduct ? selectedProduct.productName : "Select a product"}
                            </span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64 overflow-y-auto" align="start">
                          <DropdownMenuLabel>Available Products</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {products.length === 0 ? (
                            <div className="px-2 py-4 text-center text-sm text-slate-500">
                              No products found
                            </div>
                          ) : (
                            products.map((product) => (
                              <DropdownMenuItem
                                key={product._id}
                                onClick={() => handleProductSelect(product)}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{product.productName}</span>
                                  {product.sku && (
                                    <span className="text-xs text-slate-500 mt-1">
                                      SKU: {product.sku}
                                    </span>
                                  )}
                                </div>
                              </DropdownMenuItem>
                            ))
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Address Details
                    </h2>
                    <p className="text-sm text-slate-500">
                      Complete address information
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BUYER_FORM_FIELDS.address.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-rose-500">*</span>
                          )}
                        </label>
                        <input
                          type={field.type || "text"}
                          name={field.name}
                          placeholder={field.placeholder || field.label}
                          value={formData[field.name]}
                          onChange={updateField}
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Street Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={updateField}
                      rows="4"
                      placeholder="Enter complete street address..."
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
                    />
                  </div>
                </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg button-styling"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Adding...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Add Buyer
                </>
              )}
            </button>
          </div>
        </form>
          </div>
        </div>
      </main>
    </div>
  );
}
