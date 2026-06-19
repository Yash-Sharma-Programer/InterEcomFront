import Front from '../assets/Front.jfif'

const Header = () => {
    return (
        <div className="relative w-full h-\[420px\] sm\:h-\[520px\] overflow-hidden">
            <img
                className="w-full h-full object-cover"
                src={Front}
                alt="Hero Banner"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to from-black/60 to-transparent flex items-center">
                <div className="ml-8 sm:ml-16 text-white max-w-md">
                    <p className="text-sm uppercase tracking-widest text-indigo-300 font-semibold mb-2">New Arrivals 2025</p>
                    <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
                        Shop the Best <br />Deals Today
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base mb-6">
                        Discover top-quality electronics, accessories & more at unbeatable prices.
                    </p>
                    <a href="#products" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition text-sm sm:text-base shadow-lg">
                        Shop All Products →
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Header
