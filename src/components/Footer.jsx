import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { siteSettingsApi } from '../api/siteSettings.api'
import { menuApi } from '../api/menu.api'
import { pageApi } from '../api/page.api'

const SOCIAL_ICONS = {
  facebook: '📘',
  instagram: '📷',
  twitter: '🐦',
  youtube: '▶️',
}

const Footer = () => {
  const [settings, setSettings] = useState(null)
  const [footerMenu, setFooterMenu] = useState(null)
  const [pages, setPages] = useState([])

  useEffect(() => {
    siteSettingsApi.get().then(res => { if (res.data.success) setSettings(res.data.settings) }).catch(() => {})
    menuApi.getByLocation('footer').then(res => { if (res.data.success) setFooterMenu(res.data.menu) }).catch(() => {})
    pageApi.getPublished().then(res => { if (res.data.success) setPages(res.data.pages) }).catch(() => {})
  }, [])

  const siteName = settings?.siteName || 'ShopZen'
  const socialLinks = settings?.socialLinks || {}
  const activeSocials = Object.entries(socialLinks).filter(([, url]) => url)

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <h3 className="text-white text-lg font-extrabold mb-3">🛍 {siteName}</h3>
          {settings?.contactAddress && <p className="text-sm text-gray-400 mb-1">{settings.contactAddress}</p>}
          {settings?.contactEmail && <p className="text-sm text-gray-400 mb-1">{settings.contactEmail}</p>}
          {settings?.contactPhone && <p className="text-sm text-gray-400">{settings.contactPhone}</p>}

          {activeSocials.length > 0 && (
            <div className="flex gap-3 mt-4">
              {activeSocials.map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-indigo-600 transition text-sm"
                  title={key}
                >
                  {SOCIAL_ICONS[key] || '🔗'}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-white transition">All Products</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
            <li><Link to="/my-orders" className="hover:text-white transition">My Orders</Link></li>
          </ul>
        </div>

        {/* CMS footer menu, if configured */}
        {footerMenu?.items?.length > 0 && (
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">{footerMenu.name}</h4>
            <ul className="space-y-2 text-sm">
              {footerMenu.items.map(item => (
                <li key={item._id}>
                  <a
                    href={item.url}
                    target={item.openInNewTab ? '_blank' : undefined}
                    rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                    className="hover:text-white transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CMS pages */}
        {pages.length > 0 && (
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Information</h4>
            <ul className="space-y-2 text-sm">
              {pages.map(p => (
                <li key={p._id}>
                  <Link to={`/page/${p.slug}`} className="hover:text-white transition">{p.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 px-4 sm:px-6 py-5 text-center text-xs text-gray-500">
        {settings?.footerContent || `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`}
      </div>
    </footer>
  )
}

export default Footer
