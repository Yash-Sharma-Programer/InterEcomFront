import { useEffect } from 'react'
import { siteSettingsApi } from '../api/siteSettings.api'

// Applies CMS-configured site name (as page title) and favicon to the document.
// Renders nothing — purely a side-effect component.
const SiteMeta = () => {
    useEffect(() => {
        siteSettingsApi.get()
            .then(res => {
                if (!res.data.success) return
                const settings = res.data.settings

                if (settings.seoTitle || settings.siteName) {
                    document.title = settings.seoTitle || settings.siteName
                }

                if (settings.seoDescription) {
                    let meta = document.querySelector('meta[name="description"]')
                    if (!meta) {
                        meta = document.createElement('meta')
                        meta.setAttribute('name', 'description')
                        document.head.appendChild(meta)
                    }
                    meta.setAttribute('content', settings.seoDescription)
                }

                if (settings.favicon) {
                    let link = document.querySelector('link[rel="icon"]')
                    if (!link) {
                        link = document.createElement('link')
                        link.setAttribute('rel', 'icon')
                        document.head.appendChild(link)
                    }
                    link.setAttribute('href', settings.favicon)
                }
            })
            .catch(() => {})
    }, [])

    return null
}

export default SiteMeta
