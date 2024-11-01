export default {
  meta: {
    title: "Paws & Nibbles Pet Food Store",
    description: "Premium pet food and supplies for your furry friends",
    favicon: "/favicon.ico",
    format: "cajs-1",
    shadcnComponents: "Card CardHeader CardTitle CardContent Button Input Dialog DialogTrigger DialogContent AlertDialog Toast"
  },

  primaryColor: "#4F7942",  // Forest green
  secondaryColor: "#8B4513", // Saddle brown
  fontFamily: "Inter",

  pages: {
    "/": ["HomePage", "Paws & Nibbles", "Premium pet food and supplies"],
    "/products": ["ProductsPage", "Our Products", "Browse our selection of premium pet food"],
    "/product/:id": ["ProductDetailPage", "Product Details", "View product details"],
    "/cart": ["CartPage", "Shopping Cart", "Your shopping cart"],
    "/about": { type: "markdown", content: "about-us" }
  },

  components: {
    HomePage: {
      props: [],
      element: ['div.container.mx-auto.p-4', [
        ['h1.text-4xl.font-bold.mb-6', 'Welcome to Paws & Nibbles'],
        ['FeaturedProducts'],
        ['PetCategories']
      ]]
    },

    FeaturedProducts: {
      props: [],
      element: ['section.mb-8', [
        ['h2.text-2xl.font-semibold.mb-4', 'Featured Products'],
        ['div.grid.grid-cols-1.md:grid-cols-3.gap-4', [
          ['ProductCard', {
            product: {
              id: 1,
              name: "Premium Dog Kibble",
              price: 29.99,
              image: "/api/placeholder/300/300",
              description: "High-quality dog food for all breeds"
            }
          }],
          ['ProductCard', {
            product: {
              id: 2,
              name: "Grain-Free Cat Food",
              price: 24.99,
              image: "/api/placeholder/300/300",
              description: "Nutritious grain-free formula for cats"
            }
          }],
          ['ProductCard', {
            product: {
              id: 3,
              name: "Puppy Starter Kit",
              price: 39.99,
              image: "/api/placeholder/300/300",
              description: "Complete nutrition for growing puppies"
            }
          }]
        ]]
      ]]
    },

    ProductCard: {
      props: ['product'],
      element: ['Card', [
        ['CardHeader', [
          ['CardTitle', { className: 'text-xl' }, '{product.name}']
        ]],
        ['CardContent', [
          ['img', { src: '{product.image}', alt: '{product.name}', className: 'w-full h-48 object-cover mb-4' }],
          ['p.text-gray-600.mb-2', '{product.description}'],
          ['div.flex.justify-between.items-center', [
            ['span.text-lg.font-bold', '${product.price}'],
            ['Button', { onClick: '{() => addToCart(product)}' }, 'Add to Cart']
          ]]
        ]]
      ]]
    },

    PetCategories: {
      props: [],
      element: ['section.mb-8', [
        ['h2.text-2xl.font-semibold.mb-4', 'Shop by Pet'],
        ['div.grid.grid-cols-2.md:grid-cols-4.gap-4', [
          ['CategoryCard', { category: 'Dogs', icon: '🐕' }],
          ['CategoryCard', { category: 'Cats', icon: '🐱' }],
          ['CategoryCard', { category: 'Fish', icon: '🐟' }],
          ['CategoryCard', { category: 'Birds', icon: '🦜' }]
        ]]
      ]]
    },

    CategoryCard: {
      props: ['category', 'icon'],
      element: ['Card', { className: 'hover:shadow-lg transition-shadow cursor-pointer' }, [
        ['CardContent', { className: 'text-center p-6' }, [
          ['div.text-4xl.mb-2', '{icon}'],
          ['h3.text-xl.font-semibold', '{category}']
        ]]
      ]]
    }
  },

  state: {
    global: {
      cart: [],
      user: null,
      theme: "light"
    }
  },

  api: {
    "/api/products": {
      GET: "getProducts",
      POST: "addProduct"
    },
    "/api/cart": {
      GET: "getCart",
      POST: "updateCart"
    }
  },

  markdown: {
    "about-us": `
# About Paws & Nibbles

Welcome to Paws & Nibbles, your trusted source for premium pet nutrition. Since 2020, we've been committed to providing the highest quality pet food and supplies for your beloved companions.

## Our Mission

We believe every pet deserves the best nutrition possible. That's why we carefully select our products from trusted manufacturers who share our commitment to quality and sustainability.

## Quality Promise

- All products are carefully vetted for quality
- We work directly with manufacturers
- Money-back satisfaction guarantee
- Regular quality control checks
`
  }
}