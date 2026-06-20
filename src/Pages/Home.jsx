import { useEffect, useState } from 'react'
import Header from '../components/Header'
import CategoryShowcase from '../components/CategoryShowcase'
import ProductSection from '../components/ProductSection'
import BuyNowModal from '../components/BuyNowModal'
import { productApi } from '../api/product.api'

const Home = () => {
    const [featured, setFeatured] = useState([])
    const [newArrivals, setNewArrivals] = useState([])
    const [bestSellers, setBestSellers] = useState([])
    const [loading, setLoading] = useState(true)
    const [buyNowProduct, setBuyNowProduct] = useState(null)

    useEffect(() => {
        Promise.all([
            productApi.getAll({ limit: 8, sort: 'rating_desc' }),
            productApi.getAll({ limit: 8, sort: 'newest' }),
            productApi.getAll({ limit: 8, sort: 'rating_desc' }),
        ]).then(([featuredRes, newRes, bestRes]) => {
            if (featuredRes.data.success) setFeatured(featuredRes.data.products)
            if (newRes.data.success) setNewArrivals(newRes.data.products)
            if (bestRes.data.success) setBestSellers([...bestRes.data.products].reverse())
        }).catch(() => {}).finally(() => setLoading(false))
    }, [])

    return (
        <>
            <Header />
            <CategoryShowcase />
            <ProductSection
                title="Featured Products"
                products={featured}
                loading={loading}
                viewAllLink="/shop"
                onBuyNow={setBuyNowProduct}
            />
            <ProductSection
                title="New Arrivals"
                products={newArrivals}
                loading={loading}
                viewAllLink="/shop?sort=newest"
                onBuyNow={setBuyNowProduct}
            />
            <ProductSection
                title="Best Sellers"
                products={bestSellers}
                loading={loading}
                viewAllLink="/shop?sort=rating_desc"
                onBuyNow={setBuyNowProduct}
            />

            {buyNowProduct && (
                <BuyNowModal product={buyNowProduct} onClose={() => setBuyNowProduct(null)} />
            )}
        </>
    )
}

export default Home
