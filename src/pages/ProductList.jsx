import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Filter, Grid, List as ListIcon } from 'lucide-react';
import WaveText from '../components/WaveText';

const ProductList = () => {
  const { categoryId } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const category = categories.find(c => c.id === categoryId);
    setActiveCategory(category);
    
    let prods = [...(products[categoryId] || [])];
    
    if (sortBy === 'low-high') {
      prods.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
        return priceA - priceB;
      });
    } else if (sortBy === 'high-low') {
      prods.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, ""));
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, ""));
        return priceB - priceA;
      });
    }
    
    setFilteredProducts(prods);
  }, [categoryId, sortBy]);

  useEffect(() => {
    if (activeCategory?.pageBg) {
      document.documentElement.style.setProperty(
        '--dynamic-bg',
        `url(${activeCategory.pageBg})`
      );
      document.documentElement.style.setProperty('--bg-size', 'cover');
      document.documentElement.style.setProperty('--bg-pos', 'center center');
    } else if (activeCategory) {
      document.documentElement.style.setProperty('--dynamic-bg', 'var(--bg-gradient)');
    }
    // Cleanup: restore default bg when leaving page
    return () => {
      document.documentElement.style.setProperty('--dynamic-bg', 'var(--bg-gradient)');
    };
  }, [activeCategory]);

  if (!activeCategory) return <div>Loading...</div>;

  const getCategoryColor = () => {
    if (categoryId === 'lips') return '#FF4D6D';
    if (categoryId === 'face-products') return '#FF9A8B';
    if (categoryId === 'eye-makeup') return '#B721FF';
    if (categoryId === 'skincare') return '#84fab0';
    return '#FF758F';
  };

  const getCategoryGradient = () => {
    if (categoryId === 'lips') return 'linear-gradient(90deg, #FF4D6D, #FF758F)';
    if (categoryId === 'face-products') return 'linear-gradient(90deg, #FF9A8B, #FFD6C0)';
    if (categoryId === 'eye-makeup') return 'linear-gradient(90deg, #B721FF, #21D4FD)';
    if (categoryId === 'skincare') return 'linear-gradient(90deg, #84fab0, #8fd3f4)';
    return 'linear-gradient(90deg, #FF758F, #FFB3C1)';
  };

  const themeColor = getCategoryColor();
  const themeGradient = getCategoryGradient();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'transparent' }}>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
      {/* Breadcrumbs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem' }}>
        <Link to="/" style={{ color: 'inherit' }}>Home</Link> <ChevronRight size={16} />
        <span style={{ fontWeight: '600', color: themeColor }}>{activeCategory.name}</span>
      </nav>

      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}
      >
        <div style={{ flex: '1 1 600px', minWidth: '0' }}>
          <div style={{ marginBottom: '1.2rem' }}>
            <WaveText 
              text={`${activeCategory.name} Collection`}
              style={{ 
                fontSize: '3.8rem', 
                fontWeight: 900, 
                lineHeight: 1.2,
                color: themeColor,
                textShadow: '0 10px 30px rgba(0,0,0,0.3)'
              }}
            />
          </div>
          <div style={{ maxWidth: '600px' }}>
            <WaveText 
              text={`Explore our curated selection of high-performance ${activeCategory.name.toLowerCase()} products designed for professional results.`}
              style={{ 
                fontSize: '1.1rem', 
                color: 'var(--text-muted)', 
                letterSpacing: '0.05em',
                display: 'inline'
              }}
            />
          </div>
        </div>
        
        <div className="glass" style={{ 
          padding: '1rem 2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2rem', 
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`, 
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '50px' // Sleeker pill shape
        }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '800', color: themeColor }}>
              <Filter size={18} /> Filters
           </div>
           <div style={{ width: '1px', height: '24px', background: `${themeColor}40` }}></div>
           <select 
             value={sortBy} 
             onChange={(e) => setSortBy(e.target.value)}
             style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', color: 'white' }}
           >
              <option value="featured" style={{ background: '#000' }}>Sort by Featured</option>
              <option value="low-high" style={{ background: '#000' }}>Price Low to High</option>
              <option value="high-low" style={{ background: '#000' }}>Price High to Low</option>
           </select>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div 
        layout
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '1.5rem' 
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} type={categoryId} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  </div>
);
};

export default ProductList;
