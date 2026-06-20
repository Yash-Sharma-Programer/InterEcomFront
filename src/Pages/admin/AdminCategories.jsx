import { useEffect, useState } from 'react'
import { categoryApi } from '../../api/category.api'
import { toast } from 'react-toastify'

const emptyForm = { name: '', description: '', status: 'active' }

const AdminCategories = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState('')
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    const fetchCategories = () => {
        setLoading(true)
        setError('')
        categoryApi.getAll()
            .then(res => { if (res.data.success) setCategories(res.data.categories) })
            .catch(err => setError(err.response?.data?.message || 'Could not connect to server'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchCategories() }, [])

    const openAddModal = () => {
        setEditingId(null)
        setForm(emptyForm)
        setImageFile(null)
        setImagePreview('')
        setModalOpen(true)
    }

    const openEditModal = (cat) => {
        setEditingId(cat._id)
        setForm({ name: cat.name, description: cat.description || '', status: cat.status })
        setImageFile(null)
        setImagePreview(cat.image || '')
        setModalOpen(true)
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.name.trim()) { toast.error('Category name is required'); return }

        setSaving(true)
        const formData = new FormData()
        formData.append('name', form.name.trim())
        formData.append('description', form.description)
        formData.append('status', form.status)
        if (imageFile) formData.append('image', imageFile)

        try {
            const res = editingId
                ? await categoryApi.update(editingId, formData)
                : await categoryApi.create(formData)

            if (res.data.success) {
                toast.success(editingId ? 'Category updated' : 'Category created')
                setModalOpen(false)
                fetchCategories()
            } else {
                toast.error(res.data.message || 'Failed to save category')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not save category')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete category "${name}"?`)) return
        setDeletingId(id)
        try {
            const res = await categoryApi.remove(id)
            if (res.data.success) {
                toast.success('Category deleted')
                setCategories(prev => prev.filter(c => c._id !== id))
            } else {
                toast.error(res.data.message || 'Failed to delete')
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete category')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Categories</h1>
                    <p className="text-sm text-gray-500">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
                </div>
                <button onClick={openAddModal} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-medium">
                    + Add Category
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            ) : error ? (
                <p className="text-center py-16 text-gray-400">{error}</p>
            ) : categories.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">No categories yet. Add your first one!</div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map(cat => (
                        <div key={cat._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="h-32 bg-gray-50 flex items-center justify-center">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">🛍</span>
                                )}
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="font-semibold text-gray-800 truncate">{cat.name}</h3>
                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${cat.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                        {cat.status}
                                    </span>
                                </div>
                                {cat.description && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{cat.description}</p>}
                                <div className="flex gap-2">
                                    <button onClick={() => openEditModal(cat)} className="flex-1 text-xs font-medium text-indigo-600 border border-indigo-200 py-1.5 rounded-lg hover:bg-indigo-50 transition">Edit</button>
                                    <button
                                        onClick={() => handleDelete(cat._id, cat.name)}
                                        disabled={deletingId === cat._id}
                                        className="flex-1 text-xs font-medium text-red-500 border border-red-200 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                                    >
                                        {deletingId === cat._id ? '...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white rounded-t-2xl">
                            <h2 className="text-lg font-bold text-gray-800">{editingId ? 'Edit Category' : 'Add Category'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                        </div>
                        <form onSubmit={handleSave} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                                <input
                                    value={form.name}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="e.g. Electronics"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    rows={3}
                                    placeholder="Brief description..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-indigo-400 transition">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="catImg" />
                                    <label htmlFor="catImg" className="cursor-pointer block">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="" className="mx-auto h-24 object-contain rounded-lg" />
                                        ) : (
                                            <>
                                                <span className="text-2xl block mb-1">🖼</span>
                                                <p className="text-xs text-gray-500">Click to upload</p>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminCategories
