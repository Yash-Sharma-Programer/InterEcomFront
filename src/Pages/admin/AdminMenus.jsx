import { useEffect, useState } from 'react'
import { menuApi } from '../../api/menu.api'
import { toast } from 'react-toastify'

const emptyItemForm = { label: '', url: '', openInNewTab: false }

const AdminMenus = () => {
    const [menus, setMenus] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [activeLocation, setActiveLocation] = useState('header')
    const [itemForm, setItemForm] = useState(emptyItemForm)
    const [editingItemId, setEditingItemId] = useState(null)
    const [saving, setSaving] = useState(false)

    const fetchMenus = () => {
        setLoading(true)
        menuApi.getAll()
            .then(res => { if (res.data.success) setMenus(res.data.menus) })
            .catch(err => setError(err.response?.data?.message || 'Could not connect to server'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchMenus() }, [])

    const activeMenu = menus.find(m => m.location === activeLocation)

    const createMenuForLocation = async () => {
        setSaving(true)
        try {
            const res = await menuApi.create({ name: activeLocation === 'header' ? 'Header Menu' : 'Footer Menu', location: activeLocation })
            if (res.data.success) {
                toast.success('Menu created')
                setMenus(prev => [...prev, res.data.menu])
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create menu')
        } finally {
            setSaving(false)
        }
    }

    const resetItemForm = () => {
        setItemForm(emptyItemForm)
        setEditingItemId(null)
    }

    const handleItemSubmit = async (e) => {
        e.preventDefault()
        if (!activeMenu) return
        if (!itemForm.label.trim() || !itemForm.url.trim()) {
            toast.error('Label and URL are required')
            return
        }
        setSaving(true)
        try {
            const res = editingItemId
                ? await menuApi.updateItem(activeMenu._id, editingItemId, itemForm)
                : await menuApi.addItem(activeMenu._id, itemForm)
            if (res.data.success) {
                toast.success(editingItemId ? 'Menu item updated' : 'Menu item added')
                setMenus(prev => prev.map(m => m._id === activeMenu._id ? res.data.menu : m))
                resetItemForm()
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save menu item')
        } finally {
            setSaving(false)
        }
    }

    const editItem = (item) => {
        setEditingItemId(item._id)
        setItemForm({ label: item.label, url: item.url, openInNewTab: item.openInNewTab })
    }

    const deleteItem = async (itemId) => {
        if (!activeMenu) return
        try {
            const res = await menuApi.removeItem(activeMenu._id, itemId)
            if (res.data.success) {
                toast.success('Menu item removed')
                setMenus(prev => prev.map(m => m._id === activeMenu._id ? res.data.menu : m))
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove item')
        }
    }

    const moveItem = async (index, direction) => {
        if (!activeMenu) return
        const items = [...activeMenu.items].sort((a, b) => a.order - b.order)
        const targetIndex = index + direction
        if (targetIndex < 0 || targetIndex >= items.length) return
        const tmp = items[index]
        items[index] = items[targetIndex]
        items[targetIndex] = tmp
        const orderedItemIds = items.map(i => i._id)
        try {
            const res = await menuApi.reorderItems(activeMenu._id, orderedItemIds)
            if (res.data.success) {
                setMenus(prev => prev.map(m => m._id === activeMenu._id ? res.data.menu : m))
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reorder items')
        }
    }

    const sortedItems = activeMenu ? [...activeMenu.items].sort((a, b) => a.order - b.order) : []

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Menus</h1>
                <p className="text-sm text-gray-500">Manage header and footer navigation links</p>
            </div>

            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                {['header', 'footer'].map(loc => (
                    <button
                        key={loc}
                        onClick={() => { setActiveLocation(loc); resetItemForm() }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${activeLocation === loc ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {loc} Menu
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
                </div>
            ) : error ? (
                <p className="text-center py-16 text-gray-400">{error}</p>
            ) : !activeMenu ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                    <p className="text-gray-400 mb-4">No {activeLocation} menu created yet.</p>
                    <button
                        onClick={createMenuForLocation}
                        disabled={saving}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                        Create {activeLocation} Menu
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-sm text-gray-800">{activeMenu.name}</h3>
                        </div>
                        {sortedItems.length === 0 ? (
                            <p className="text-center py-12 text-gray-400 text-sm">No items yet. Add one →</p>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {sortedItems.map((item, idx) => (
                                    <div key={item._id} className="px-5 py-3 flex items-center gap-3">
                                        <div className="flex flex-col gap-0.5 shrink-0">
                                            <button onClick={() => moveItem(idx, -1)} disabled={idx === 0} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 text-xs leading-none">▲</button>
                                            <button onClick={() => moveItem(idx, 1)} disabled={idx === sortedItems.length - 1} className="text-gray-300 hover:text-gray-600 disabled:opacity-30 text-xs leading-none">▼</button>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{item.label}</p>
                                            <p className="text-xs text-gray-400 truncate">{item.url}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => editItem(item)} className="text-xs text-indigo-600 hover:underline">Edit</button>
                                            <button onClick={() => deleteItem(item._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 h-fit">
                        <h3 className="font-semibold text-sm text-gray-800 mb-4">{editingItemId ? 'Edit Item' : 'Add Menu Item'}</h3>
                        <form onSubmit={handleItemSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={itemForm.label}
                                    onChange={e => setItemForm(f => ({ ...f, label: e.target.value }))}
                                    placeholder="e.g. Contact Us"
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                                <input
                                    type="text"
                                    value={itemForm.url}
                                    onChange={e => setItemForm(f => ({ ...f, url: e.target.value }))}
                                    placeholder="/page/contact-us or https://..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                    required
                                />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={itemForm.openInNewTab}
                                    onChange={e => setItemForm(f => ({ ...f, openInNewTab: e.target.checked }))}
                                />
                                Open in new tab
                            </label>
                            <div className="flex gap-2 pt-1">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                                >
                                    {editingItemId ? 'Update Item' : 'Add Item'}
                                </button>
                                {editingItemId && (
                                    <button
                                        type="button"
                                        onClick={resetItemForm}
                                        className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminMenus
