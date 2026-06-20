import { useState, useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { productApi } from "../../api/product.api";
import { categoryApi } from "../../api/category.api";
import { toast } from "react-toastify";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("0");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("active");

  const [existingImages, setExistingImages] = useState([]); // URLs already on the product (edit mode)
  const [newFiles, setNewFiles] = useState([]); // File objects to upload
  const [previews, setPreviews] = useState([]); // object URLs for newFiles

  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [error, setError] = useState("");

  useEffect(() => {
    categoryApi.getAll().then(res => { if (res.data.success) setCategories(res.data.categories) }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    productApi.getById(id)
      .then(res => {
        if (res.data.success) {
          const p = res.data.product;
          setProductName(p.Product_name);
          setProductPrice(String(p.Product_Price));
          setDescription(p.description || "");
          setStock(String(p.stock ?? 0));
          setCategory(p.category?._id || "");
          setStatus(p.status || "active");
          setExistingImages(p.images?.length ? p.images : (p.Product_URl ? [p.Product_URl] : []));
        } else {
          setError("Product not found");
        }
      })
      .catch(() => setError("Could not load product"))
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const totalCount = existingImages.length + newFiles.length + files.length;
    if (totalCount > 6) {
      toast.error("Maximum 6 images allowed per product");
      return;
    }
    setNewFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewFile = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!productName.trim() || !productPrice) {
      setError("Product name and price are required");
      return;
    }
    if (existingImages.length + newFiles.length === 0) {
      setError("At least one product image is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("productName", productName.trim());
    formData.append("productPrice", productPrice);
    formData.append("description", description);
    formData.append("stock", stock);
    formData.append("category", category);
    formData.append("status", status);
    newFiles.forEach(f => formData.append("images", f));
    if (isEdit) formData.append("existingImages", JSON.stringify(existingImages));

    try {
      const res = isEdit
        ? await productApi.update(id, formData)
        : await productApi.create(formData);

      if (res.data.success) {
        toast.success(isEdit ? "Product updated successfully" : "Product added successfully");
        navigate("/admin/products");
      } else {
        setError(res.data.message || "Failed to save product");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <NavLink to="/admin/products" className="text-sm text-indigo-600 hover:underline">← Back to Products</NavLink>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 mt-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">{isEdit ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-gray-500 text-sm mt-1">{isEdit ? "Update product details" : "Fill in the details to list a product"}</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5 Headphones"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the product..."
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                value={productPrice}
                onChange={e => setProductPrice(e.target.value)}
                placeholder="e.g. 2999"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
                placeholder="e.g. 50"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
              >
                <option value="">No Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (up to 6)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="imgUpload"
              />
              <label htmlFor="imgUpload" className="cursor-pointer block">
                <span className="text-3xl block mb-2">🖼</span>
                <p className="text-sm text-gray-500">Click to add product images</p>
              </label>
            </div>

            {(existingImages.length > 0 || previews.length > 0) && (
              <div className="flex flex-wrap gap-3 mt-3">
                {existingImages.map((img, i) => (
                  <div key={`existing-${i}`} className="relative w-20 h-20">
                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                    >×</button>
                  </div>
                ))}
                {previews.map((src, i) => (
                  <div key={`new-${i}`} className="relative w-20 h-20">
                    <img src={src} alt="" className="w-full h-full object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => removeNewFile(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
