import { useEffect, useState } from 'react'
import Front from '../assets/Front.jfif'
import { NavLink } from 'react-router-dom'
import { siteSettingsApi } from '../api/siteSettings.api'

const Header = () => {
    const [banners, setBanners] = useState([])
    const [active, setActive] = useState(0)

    useEffect(() => {
        siteSettingsApi.get()
            .then(res => {
                if (res.data.success && res.data.settings.banners?.length) {
                    setBanners([...res.data.settings.banners].sort((a, b) => a.order - b.order))
                }
            })
            .catch(() => {})
    }, [])

    useEffect(() => {
        if (banners.length < 2) return
        const t = setInterval(() => setActive(i => (i + 1) % banners.length), 5000)
        return () => clearInterval(t)
    }, [banners.length])

    // No CMS banners configured — show the default static hero
    if (banners.length === 0) {
        return (
            <div className="relative w-full h-[340px] sm:h-[440px] md:h-[520px] overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={Front}
                    alt="Hero Banner"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent flex items-center">
                    <div className="ml-5 sm:ml-10 md:ml-16 text-white max-w-xs sm:max-w-md">
                        <p className="text-xs sm:text-sm uppercase tracking-widest text-indigo-300 font-semibold mb-2">New Arrivals 2026</p>
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 sm:mb-4">
                            Shop the Best <br />Deals Today
                        </h1>
                        <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-5 sm:mb-6">
                            Discover top-quality electronics, accessories & more at unbeatable prices.
                        </p>
                        <NavLink to="/shop" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition text-xs sm:text-sm md:text-base shadow-lg">
                            Shop All Products →
                        </NavLink>
                    </div>
                </div>
            </div>
        )
    }

    const banner = banners[active]
    const BannerContent = () => (
        <>
            <img
                className="w-full h-full object-cover"
                src={banner.image}
                alt={banner.title || 'Banner'}
            />
            {(banner.title || banner.subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent flex items-center">
                    <div className="ml-5 sm:ml-10 md:ml-16 text-white max-w-xs sm:max-w-md">
                        {banner.title && (
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-3 sm:mb-4">
                                {banner.title}
                            </h1>
                        )}
                        {banner.subtitle && (
                            <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-5 sm:mb-6">
                                {banner.subtitle}
                            </p>
                        )}
                        <NavLink to="/shop" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition text-xs sm:text-sm md:text-base shadow-lg">
                            Shop All Products →
                        </NavLink>
                    </div>
                </div>
            )}
        </>
    )

    return (
        <div className="relative w-full h-[340px] sm:h-[440px] md:h-[520px] overflow-hidden">
            {banner.link ? (
                <a href={banner.link} className="block w-full h-full">
                    <BannerContent />
                </a>
            ) : (
                <BannerContent />
            )}

            {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            aria-label={`Go to banner ${i + 1}`}
                            className={`w-2 h-2 rounded-full transition ${i === active ? 'bg-white w-6' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Header
