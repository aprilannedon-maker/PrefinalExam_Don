import { useState } from 'react'
import { ShoppingCart, Plus, Minus, Info, Star, X, Filter, Trash2 } from 'lucide-react'

export interface Product {
  id: string
  imageUrl: string
  name: string
  category: string
  description: string
  specification: string
  rating: number
  price: number
  quantity: number 
  cartQuantity: number 
  stock: number
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise-Canceling Headphones',
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    description: 'High-quality over-ear wireless headphones with active noise cancellation and plush ear cushions.',
    specification: 'Bluetooth 5.2, 30-hour battery life, USB-C charging',
    rating: 4.8,
    price: 199.99,
    quantity: 0,
    cartQuantity: 0,
    stock: 15,
  },
  {
    id: '2',
    name: 'Ergonomic Gaming Mouse',
    category: 'Peripherals',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80',
    description: 'Precision gaming mouse with customizable RGB lighting and high-DPI optical sensor.',
    specification: '16000 DPI, 7 programmable buttons, lightweight design',
    rating: 4.5,
    price: 49.99,
    quantity: 0,
    cartQuantity: 0,
    stock: 15,
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    category: 'Peripherals',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80',
    description: 'Compact mechanical keyboard featuring tactile switches, dynamic backlighting, and sturdy aluminum frame.',
    specification: 'RGB backlit, hot-swappable switches, detachable cable',
    rating: 4.7,
    price: 89.99,
    quantity: 0,
    cartQuantity: 0,
    stock: 15,
  },
  {
    id: '4',
    name: 'Ultra-Wide 4K Monitor',
    category: 'Displays',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80',
    description: 'Immersive ultra-wide display offering stunning color accuracy, deep contrast, and smooth refresh rates.',
    specification: '34-inch IPS Panel, 144Hz, HDR400, USB-C Hub',
    rating: 4.9,
    price: 449.99,
    quantity: 0,
    cartQuantity: 0,
    stock: 15,
  },
]

export default function App() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  
  const [activeDescriptionProduct, setActiveDescriptionProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState<boolean>(false)
  const [showCartModal, setShowCartModal] = useState<boolean>(false)

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    imageUrl: '',
    description: '',
    specification: '',
    rating: '',
    price: '',
    stock: '',
  })
  const [formError, setFormError] = useState('')

  // Grand total and item counts based on confirmed cartQuantity
  const overallTotal = products.reduce((sum, item) => sum + item.price * item.cartQuantity, 0)
  const totalItemsCount = products.reduce((sum, item) => sum + item.cartQuantity, 0)

  const cartItems = products.filter((p) => p.cartQuantity > 0)
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const handleQuantityChange = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newQty = Math.max(0, Math.min(p.stock, p.quantity + delta))
          return { ...p, quantity: newQty }
        }
        return p
      })
    )
  }

  // Handle "Add to Cart" button click (transfers card quantity to cartQuantity)
  const handleAddToCart = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          if (p.quantity === 0) return p 
          return { ...p, cartQuantity: p.quantity }
        }
        return p
      })
    )
  }

  const handleRemoveFromCart = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, cartQuantity: 0, quantity: 0 }
        }
        return p
      })
    )
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.category || !newProduct.imageUrl || !newProduct.description || !newProduct.specification || !newProduct.rating || !newProduct.price || !newProduct.stock) {
      setFormError('Please fill out all fields!')
      return
    }

    const createdProduct: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      category: newProduct.category,
      imageUrl: newProduct.imageUrl,
      description: newProduct.description,
      specification: newProduct.specification,
      rating: parseFloat(newProduct.rating),
      price: parseFloat(newProduct.price),
      quantity: 0,
      cartQuantity: 0,
      stock: parseInt(newProduct.stock, 10),
    }

    setProducts([...products, createdProduct])
    setShowAddModal(false)
    setNewProduct({ name: '', category: '', imageUrl: '', description: '', specification: '', rating: '', price: '', stock: '' })
    setFormError('')
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b border-gray-200 sticky top-0 bg-white z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Product<span className="text-red-500">ManagementApp</span>
          </h1>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest uppercase text-gray-600">
            <a href="#" className="hover:text-red-500 transition-colors">About</a>
            <a href="#" className="text-red-500">Our Catalog</a>
            <a href="#" className="hover:text-red-500 transition-colors">Shop</a>
            <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs uppercase px-3 py-2 rounded-lg transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>

            <button
              onClick={() => setShowCartModal(true)}
              className="relative flex items-center bg-gray-100 px-3.5 py-2 rounded-full gap-2 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4 text-gray-700" />
              <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItemsCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      <section className="text-center py-16 px-4 bg-gray-50/50 border-b border-gray-100">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-900 mb-3">
          Our Tech Products
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Explore our collection of high-performance peripherals and gear. Use the controls on each product card to select quantities for your order.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overall Total:</span>
          <span className="text-lg font-black text-red-500">${overallTotal.toFixed(2)}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const subtotal = product.price * product.quantity
            const remainingStock = product.stock - product.quantity
            const isLowStock = remainingStock < 5

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {isLowStock && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        Low Stock ({remainingStock} left)
                      </span>
                    )}

                    <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-1 text-amber-400 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                      <span className="text-xs text-gray-400 ml-1 font-medium">({product.rating})</span>
                    </div>

                    <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1">
                      {product.name}
                    </h3>

                    <button
                      onClick={() => setActiveDescriptionProduct(product)}
                      className="mt-1.5 text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5" /> View Description & Specs
                    </button>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-gray-100 mt-2">
                  <div className="flex items-center justify-between my-3 text-xs">
                    <span className="text-gray-400 font-medium">Subtotal:</span>
                    <span className="font-extrabold text-gray-900 text-sm">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="p-1 hover:bg-white rounded text-gray-600 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold px-2.5 text-gray-800">{product.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="p-1 hover:bg-white rounded text-gray-600 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Add to Cart button saves current quantity to cart without auto-incrementing on extra clicks */}
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Description Modal */}
      {activeDescriptionProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-xl">
            <button
              onClick={() => setActiveDescriptionProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeDescriptionProduct.imageUrl}
              alt={activeDescriptionProduct.name}
              className="w-full h-40 object-cover rounded-xl mb-4"
            />

            <span className="text-xs font-bold uppercase tracking-wider text-red-500">
              {activeDescriptionProduct.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-1">
              {activeDescriptionProduct.name}
            </h3>

            <div className="mt-3 space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Description</p>
                <p className="text-sm text-gray-600 mt-0.5">{activeDescriptionProduct.description}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase">Specifications</p>
                <p className="text-sm text-gray-600 mt-0.5">{activeDescriptionProduct.specification}</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <div>
                  <p className="text-xs text-gray-400">Price</p>
                  <p className="text-lg font-extrabold text-gray-900">${activeDescriptionProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="text-sm font-bold text-amber-500">★ {activeDescriptionProduct.rating} / 5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCartModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-red-500" />
                <h3 className="text-xl font-bold text-gray-900">Your Cart ({totalItemsCount} items)</h3>
              </div>
              <button
                onClick={() => setShowCartModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium text-sm">Your cart is currently empty.</p>
                  <p className="text-xs text-gray-400 mt-1">Select quantity and click "Add to Cart"!</p>
                </div>
              ) : (
                cartItems.map((item) => {
                  const itemSubtotal = item.price * item.cartQuantity
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-lg border" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500">${item.price.toFixed(2)} × {item.cartQuantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-sm text-gray-900">${itemSubtotal.toFixed(2)}</p>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold mt-1 flex items-center gap-0.5 ml-auto cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-600">Grand Total:</span>
                  <span className="text-xl font-black text-red-500">${overallTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => {
                    alert('Order submitted successfully!')
                    setShowCartModal(false)
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Product</h3>

            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Mouse"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Peripherals"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="4.5"
                    value={newProduct.rating}
                    onChange={(e) => setNewProduct({ ...newProduct, rating: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="49.99"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Total Stock</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short product description..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Specification</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless, Bluetooth 5.0"
                  value={newProduct.specification}
                  onChange={(e) => setNewProduct({ ...newProduct, specification: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-2 cursor-pointer"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}