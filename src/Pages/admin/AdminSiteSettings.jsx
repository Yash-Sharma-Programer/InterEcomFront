import { useEffect, useState } from 'react'
import { siteSettingsApi } from '../../api/siteSettings.api'
import { toast } from 'react-toastify'

const AdminSiteSettings = () => {
    const [settings, setSettings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState(null)

    const [logoFile, setLogoFile] = useState(null)
    const [faviconFile, setFaviconFile] = useState(null)
    const [bannerFile, setBannerFile] = useState(null)
    const [bannerMeta, setBannerMeta] = useState({ title: '', subtitle: '', link: '' })
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [uploadingFavicon, setUploadingFavicon] = useState(false)
    const [uploadingBanner, setUploadingBanner] = useState(false)

    const fetchSettings = () => {
        setLoading(true)
        siteSettingsApi.get()
            .then(res => {
                if (res.data.success) {
                    setSettings(res.data.settings)
                    setForm({
                        siteName: res.data.settings.siteName || '',
                        contactEmail: res.data.settings.contactEmail || '',
                        contactPhone: res.data.settings.contactPhone || '',
                        contactAddress: res.data.settings.contactAddress || '',
                        footerContent: res.data.settings.footerContent || '',
                        seoTitle: res.data.settings.seoTitle || '',
                        seoDescription: res.data.settings.seoDescription || '',
                        emailFrom: res.data.settings.emailFrom || '',
                        facebook: res.data.settings.socialLinks?.facebook || '',
                        instagram: res.data.settings.socialLinks?.instagram || '',
                        twitter: res.data.settings.socialLinks?.twitter || '',
                        youtube: res.data.settings.socialLinks?.youtube || '',
                    })
                }
            })
            .catch(err => setError(err.response?.data?.message || 'Could not connect to server'))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchSettings() }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await siteSettingsApi.update(form)
            if (res.data.success) {
                toast.success('Site settings saved')
                setSettings(res.data.settings)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handleLogoUpload = async () => {
        if (!logoFile) return
        setUploadingLogo(true)
        try {
            const fd = new FormData()
            fd.append('logo', logoFile)
            const res = await siteSettingsApi.updateLogo(fd)
            if (res.data.success) {
                toast.success('Logo updated')
                setSettings(res.data.settings)
                setLogoFile(null)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload logo')
        } finally {
            setUploadingLogo(false)
        }
    }

    const handleFaviconUpload = async () => {
        if (!faviconFile) return
        setUploadingFavicon(true)
        try {
            const fd = new FormData()
            fd.append('favicon', faviconFile)
            const res = await siteSettingsApi.updateFavicon(fd)
            if (res.data.success) {
                toast.success('Favicon updated')
                setSettings(res.data.settings)
                setFaviconFile(null)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload favicon')
        } finally {
            setUploadingFavicon(false)
        }
    }

    const handleBannerUpload = async () => {
        if (!bannerFile) {
            toast.error('Choose a banner image first')
            return
        }
        setUploadingBanner(true)
        try {
            const fd = new FormData()
            fd.append('image', bannerFile)
            fd.append('title', bannerMeta.title)
            fd.append('subtitle', bannerMeta.subtitle)
            fd.append('link', bannerMeta.link)
            const res = await siteSettingsApi.addBanner(fd)
            if (res.data.success) {
                toast.success('Banner added')
                setSettings(res.data.settings)
                setBannerFile(null)
                setBannerMeta({ title: '', subtitle: '', link: '' })
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add banner')
        } finally {
            setUploadingBanner(false)
        }
    }

    const handleBannerDelete = async (bannerId) => {
        try {
            const res = await siteSettingsApi.removeBanner(bannerId)
            if (res.data.success) {
                toast.success('Banner removed')
                setSettings(res.data.settings)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to remove banner')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        )
    }

    if (error || !settings || !form) {
        return <p className="text-center py-16 text-gray-400">{error || 'Could not load settings'}</p>
    }

    const inputClass = "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-400 transition"
    const labelClass = "block text-sm font-medium text-gray-700 mb-1"

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Site Settings</h1>
                <p className="text-sm text-gray-500">Logo, contact info, social links, banners, SEO</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <h2 className="font-semibold text-gray-800 mb-4">Branding</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Logo</label>
                        <div className="flex items-center gap-3">
                            {settings.logo && <img src={settings.logo} alt="logo" className="w-12 h-12 object-contain border rounded-lg" />}
                            <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} className="text-xs flex-1" />
                        </div>
                        <button
                            onClick={handleLogoUpload}
                            disabled={!logoFile || uploadingLogo}
                            className="mt-2 text-xs font-semibold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition disabled:opacity-50"
                        >
                            {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                        </button>
                    </div>
                    <div>
                        <label className={labelClass}>Favicon</label>
                        <div className="flex items-center gap-3">
                            {settings.favicon && <img src={settings.favicon} alt="favicon" className="w-8 h-8 object-contain border rounded-lg" />}
                            <input type="file" accept="image/*" onChange={e => setFaviconFile(e.target.files[0])} className="text-xs flex-1" />
                        </div>
                        <button
                            onClick={handleFaviconUpload}
                            disabled={!faviconFile || uploadingFavicon}
                            className="mt-2 text-xs font-semibold text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition disabled:opacity-50"
                        >
                            {uploadingFavicon ? 'Uploading...' : 'Upload Favicon'}
                        </button>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
                    <h2 className="font-semibold text-gray-800">General</h2>
                    <div>
                        <label className={labelClass}>Site Name</label>
                        <input type="text" value={form.siteName} onChange={e => setForm(f => ({ ...f, siteName: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Footer Content</label>
                        <textarea value={form.footerContent} onChange={e => setForm(f => ({ ...f, footerContent: e.target.value }))} rows={3} className={inputClass} placeholder="Short text shown in the footer" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
                    <h2 className="font-semibold text-gray-800">Contact Information</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Contact Email</label>
                            <input type="email" value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Contact Phone</label>
                            <input type="text" value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Address</label>
                        <input type="text" value={form.contactAddress} onChange={e => setForm(f => ({ ...f, contactAddress: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>"From" Email (for system emails)</label>
                        <input type="email" value={form.emailFrom} onChange={e => setForm(f => ({ ...f, emailFrom: e.target.value }))} className={inputClass} placeholder="orders@yourstore.com" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
                    <h2 className="font-semibold text-gray-800">Social Media Links</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Facebook</label>
                            <input type="text" value={form.facebook} onChange={e => setForm(f => ({ ...f, facebook: e.target.value }))} className={inputClass} placeholder="https://facebook.com/..." />
                        </div>
                        <div>
                            <label className={labelClass}>Instagram</label>
                            <input type="text" value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} className={inputClass} placeholder="https://instagram.com/..." />
                        </div>
                        <div>
                            <label className={labelClass}>Twitter / X</label>
                            <input type="text" value={form.twitter} onChange={e => setForm(f => ({ ...f, twitter: e.target.value }))} className={inputClass} placeholder="https://x.com/..." />
                        </div>
                        <div>
                            <label className={labelClass}>YouTube</label>
                            <input type="text" value={form.youtube} onChange={e => setForm(f => ({ ...f, youtube: e.target.value }))} className={inputClass} placeholder="https://youtube.com/..." />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
                    <h2 className="font-semibold text-gray-800">SEO Settings</h2>
                    <div>
                        <label className={labelClass}>SEO Title</label>
                        <input type="text" value={form.seoTitle} onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))} className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>SEO Description</label>
                        <textarea value={form.seoDescription} onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))} rows={2} className={inputClass} />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
                >
                    {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
                <h2 className="font-semibold text-gray-800">Homepage Banners</h2>

                {settings.banners?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[...settings.banners].sort((a, b) => a.order - b.order).map(b => (
                            <div key={b._id} className="relative rounded-xl overflow-hidden border border-gray-100">
                                <img src={b.image} alt={b.title} className="w-full h-28 object-cover" />
                                {(b.title || b.subtitle) && (
                                    <div className="p-2">
                                        {b.title && <p className="text-xs font-semibold text-gray-800 truncate">{b.title}</p>}
                                        {b.subtitle && <p className="text-xs text-gray-400 truncate">{b.subtitle}</p>}
                                    </div>
                                )}
                                <button
                                    onClick={() => handleBannerDelete(b._id)}
                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                                >×</button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="border-t border-gray-100 pt-4 space-y-3">
                    <p className="text-sm font-medium text-gray-700">Add a banner</p>
                    <input type="file" accept="image/*" onChange={e => setBannerFile(e.target.files[0])} className="text-xs" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input type="text" value={bannerMeta.title} onChange={e => setBannerMeta(m => ({ ...m, title: e.target.value }))} placeholder="Title (optional)" className={inputClass} />
                        <input type="text" value={bannerMeta.subtitle} onChange={e => setBannerMeta(m => ({ ...m, subtitle: e.target.value }))} placeholder="Subtitle (optional)" className={inputClass} />
                        <input type="text" value={bannerMeta.link} onChange={e => setBannerMeta(m => ({ ...m, link: e.target.value }))} placeholder="Link (optional)" className={inputClass} />
                    </div>
                    <button
                        onClick={handleBannerUpload}
                        disabled={uploadingBanner}
                        className="text-sm font-semibold text-white bg-indigo-600 px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                        {uploadingBanner ? 'Uploading...' : 'Add Banner'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminSiteSettings
