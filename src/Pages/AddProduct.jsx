import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate()
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [productPrice, setProductPrice] = useState("");
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setProductImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError("")

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productImage", productImage);
    formData.append("productPrice", productPrice);

    try {
      const res = await fetch("https://ecom-backend-six-sigma.vercel.app/addproduct", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (data.success) {
        navigate('/')
      } else {
        setError(data.message || "Failed to add product")
      }
    } catch {
      setError("Could not connect to server")
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">📦</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Add New Product</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to list a product</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 transition cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="imgUpload"
                required
              />
              <label htmlFor="imgUpload" className="cursor-pointer">
                {preview ? (
                  <img src={preview} alt="Preview" className="mx-auto h-32 object-contain rounded-lg" />
                ) : (
                  <>
                    <span className="text-3xl block mb-2">🖼</span>
                    <p className="text-sm text-gray-500">Click to upload product image</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
            <input
              type="number"
              value={productPrice}
              onChange={e => setProductPrice(e.target.value)}
              placeholder="e.g. 2999"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
              required
              min="1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
