import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, NavLink } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import { userApi } from '../api/user.api'
import { toast } from 'react-toastify'

const emptyAddress = { label: 'Home', name: '', phone: '', street: '', city: '', pincode: '', isDefault: false }

const Profile = () => {
    const { user, logout, login } = useAuth()
    const navigate = useNavigate()

    const [editingName, setEditingName] = useState(false)
    const [name, setName] = useState(user?.name || '')
    const [savingName, setSavingName] = useState(false)

    const [addresses, setAddresses] = useState(user?.addresses || [])
    const [showAddressForm, setShowAddressForm] = useState(false)
    const [addressForm, setAddressForm] = useState(emptyAddress)
    const [savingAddress, setSavingAddress] = useState(false)

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 px-4 text-center">
                <span className="text-5xl">🔒</span>
                <h2 className="text-xl font-bold text-gray-700">Please log in to view your profile</h2>
                <button
                    onClick={() => navigate('/login')}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition font-medium"
                >
                    Go to Login
                </button>
            </div>
        )
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const initials = user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const handleSaveName = async () => {
        if (!name.trim()) return
        setSavingName(true)
        try {
            const res = await authApi.updateProfile({ name: name.trim() })
            if (res.data.success) {
                login({ ...user, name: res.data.user.name })
                toast.success('Profile updated')
                setEditingName(false)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not update profile')
        } finally {
            setSavingName(false)
        }
    }

    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target
        setAddressForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSaveAddress = async (e) => {
        e.preventDefault()
        const { name, phone, street, city, pincode } = addressForm
        if (!name || !phone || !street || !city || !pincode) {
            toast.error('Please fill in all address fields')
            return
        }
        if (!/^\d{10}$/.test(phone)) { toast.error('Enter a valid 10-digit phone number'); return }
        if (!/^\d{6}$/.test(pincode)) { toast.error('Enter a valid 6-digit pincode'); return }

        setSavingAddress(true)
        try {
            const res = await userApi.addAddress(addressForm)
            if (res.data.success) {
                setAddresses(res.data.addresses)
                toast.success('Address saved')
                setShowAddressForm(false)
                setAddressForm(emptyAddress)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not save address')
        } finally {
            setSavingAddress(false)
        }
    }

    const handleDeleteAddress = async (addressId) => {
        try {
            const res = await userApi.deleteAddress(addressId)
            if (res.data.success) {
                setAddresses(res.data.addresses)
                toast.success('Address removed')
            }
        } catch {
            toast.error('Could not remove address')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-10 px-4">
            <div className="max-w-2xl mx-auto space-y-6">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-20 sm:h-24"></div>
                    <div className="px-5 sm:px-6 pb-6 -mt-10 sm:-mt-12">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-xl sm:text-2xl font-extrabold text-indigo-600 mb-3">
                            {initials}
                        </div>
                        {editingName ? (
                            <div className="flex items-center gap-2 mb-1">
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="text-lg sm:text-xl font-bold text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-400"
                                />
                                <button onClick={handleSaveName} disabled={savingName} className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-60">
                                    {savingName ? '...' : 'Save'}
                                </button>
                                <button onClick={() => { setEditingName(false); setName(user.name) }} className="text-sm text-gray-400 px-2">Cancel</button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{user.name}</h1>
                                <button onClick={() => setEditingName(true)} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">✏️ Edit</button>
                            </div>
                        )}
                        <p className="text-gray-500 text-sm">{user.email}</p>
                    </div>
                </div>

                {/* Saved Addresses */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-700">📍 Saved Addresses</h2>
                        <button
                            onClick={() => setShowAddressForm(o => !o)}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            {showAddressForm ? 'Cancel' : '+ Add New'}
                        </button>
                    </div>

                    {showAddressForm && (
                        <form onSubmit={handleSaveAddress} className="space-y-2 mb-4 bg-gray-50 rounded-xl p-4">
                            <div className="grid grid-cols-2 gap-2">
                                <input name="label" placeholder="Label (e.g. Home, Work)" value={addressForm.label} onChange={handleAddressChange}
                                    className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                <input name="name" placeholder="Full Name" value={addressForm.name} onChange={handleAddressChange}
                                    className="col-span-2 sm:col-span-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                <input name="phone" placeholder="Phone (10 digits)" value={addressForm.phone} onChange={handleAddressChange}
                                    className="col-span-2 sm:col-span-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                <input name="street" placeholder="Street / Flat / Area" value={addressForm.street} onChange={handleAddressChange}
                                    className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                <input name="city" placeholder="City" value={addressForm.city} onChange={handleAddressChange}
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                                <input name="pincode" placeholder="Pincode (6 digits)" value={addressForm.pincode} onChange={handleAddressChange}
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                            </div>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={handleAddressChange} />
                                Set as default address
                            </label>
                            <button type="submit" disabled={savingAddress} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60">
                                {savingAddress ? 'Saving...' : 'Save Address'}
                            </button>
                        </form>
                    )}

                    {addresses.length === 0 ? (
                        <p className="text-gray-400 text-sm">No saved addresses yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {addresses.map(addr => (
                                <div key={addr._id} className="flex items-start justify-between gap-3 border border-gray-100 rounded-xl p-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-gray-800">{addr.label}</span>
                                            {addr.isDefault && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">Default</span>}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{addr.name} · {addr.phone}</p>
                                        <p className="text-xs text-gray-400">{addr.street}, {addr.city} — {addr.pincode}</p>
                                    </div>
                                    <button onClick={() => handleDeleteAddress(addr._id)} className="text-red-400 hover:text-red-600 text-sm shrink-0">🗑</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-2">
                    <h2 className="text-base font-bold text-gray-700 mb-2">Account</h2>
                    <NavLink to="/my-orders" className="w-full flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl transition">
                        📦 <span>My Orders</span>
                    </NavLink>
                    <NavLink to="/wishlist" className="w-full flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl transition">
                        ♡ <span>My Wishlist</span>
                    </NavLink>
                    <NavLink to="/" className="w-full flex items-center gap-3 text-sm text-gray-600 hover:bg-gray-50 px-4 py-3 rounded-xl transition">
                        🏠 <span>Back to Home</span>
                    </NavLink>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 text-sm text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl transition font-medium border border-red-100"
                    >
                        🚪 <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Profile
