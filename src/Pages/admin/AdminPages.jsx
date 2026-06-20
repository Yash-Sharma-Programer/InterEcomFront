import { useEffect, useState } from 'react'
import { pageApi } from '../../api/page.api'
import { toast } from 'react-toastify'

const emptyForm = { title: '', slug: '', content: '', status: 'published', metaTitle: '', metaDescription: '' }

const AdminPages = () => {
    const [pages, setPages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)

    const fetchPages = () => {
        setLoading(true)
        pageApi.getAllAdmin()
            .then(res => { if (res.data.success) setPages(res.data.pages) })
            .catch(err => setError(err.response?.data?.message || 'Could not connect to server'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchPages() }, [])

    const openCreate = () => {
        setEditingId(null)
        setForm(emptyForm)
        setModalOpen(true)
    }

    const openEdit = (page) => {
        setEditingId(page._id)
        setForm({
            title: page.title,
            slug: page.slug,
            content: page.content || '',
            status: page.status,
            metaTitle: page.metaTitle || '',
            metaDescription: page.metaDescription || ''
        })
        setModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.title.trim()) {
            toast.error('Page title is required')
            return
        }
        setSaving(true)
        try {
            const res = editingId
                ? await pageApi.update(editingId, form)
                : await pageApi.create(form)
            if (res.data.success) {
                toast.success(editingId ? 'Page updated' : 'Page created')
                setModalOpen(false)
                fetchPages()
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save page')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this page? This cannot be undone.')) return
        try {
            const res = await pageApi.remove(id)
            if (res.data.success) {
                toast.success('Page deleted')
                setPages(prev => prev.filter(p => p._id !== id))
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete page')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Pages</h1>
                    <p className="text-sm text-gray-500">Manage static pages like About Us, FAQ, Privacy Policy</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition w-full sm:w-auto"
                >
                    + New Page
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-16">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                ) : error ? (
                    <p className="text-center py-16 text-gray-400">{error}</p>
                ) : pages.length === 0 ? (
                    <p className="text-center py-16 text-gray-400">No pages yet. Create your first page.</p>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {pages.map(p => (
                            <div key={p._id} className="px-5 sm:px-6 py-4 flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-sm text-gray-800">{p.title}</span>
                                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${p.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-0.5">/page/{p.slug}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button
                                        onClick={() => openEdit(p)}
                                        className="text-xs font-medium text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        className="text-xs font-medium text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-800">{editingId ? 'Edit Page' : 'New Page'}</h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 text-xl leading-none">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. About Us"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                    placeholder="auto-generated from title if left blank"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                <textarea
                                    value={form.content}
                                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    rows={8}
                                    placeholder="Page content..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <details className="text-sm">
                                <summary className="cursor-pointer text-gray-500 font-medium">SEO settings (optional)</summary>
                                <div className="mt-3 space-y-3">
                                    <input
                                        type="text"
                                        value={form.metaTitle}
                                        onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                                        placeholder="Meta title"
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                    />
                                    <textarea
                                        value={form.metaDescription}
                                        onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
                                        placeholder="Meta description"
                                        rows={2}
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                    />
                                </div>
                            </details>
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : editingId ? 'Update Page' : 'Create Page'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminPages
