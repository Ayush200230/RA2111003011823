// index.js

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Mock token for demonstration purposes
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzEyMTU1ODIxLCJpYXQiOjE3MTIxNTU1MjEsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImY4NWZjM2MyLTY1MTMtNDI5MC05NzlmLTc4ZDBkZjg3OTgwYyIsInN1YiI6ImFnMzg3MkBzcm1pc3QuZWR1LmluIn0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiJmODVmYzNjMi02NTEzLTQyOTAtOTc5Zi03OGQwZGY4Nzk4MGMiLCJjbGllbnRTZWNyZXQiOiJ4eVlYTElqQ1V3REVTckJ3Iiwib3duZXJOYW1lIjoiQXl1c2ggR2FyZyIsIm93bmVyRW1haWwiOiJhZzM4NzJAc3JtaXN0LmVkdS5pbiIsInJvbGxObyI6IlJBMjExMTAwMzAxMTgyMyJ9._OXEfvoTE_OepHgUVIQmPRiopHTL3woho4UiDZtbfQI';

// Function to make a request to the test server API
const fetchProducts = async (companyName, categoryName, topN, minPrice, maxPrice, sort, sortOrder) => {
  try {
    const response = await axios.get(`http://20.244.56.144/test/companies/${companyName}/categories/${categoryName}/products?top=${topN}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      }
    });

    // Sort products based on the specified sorting method and order
    const sortedProducts = response.data.sort((a, b) => {
      let comparison = 0;
      switch (sortOrder) {
        case 'asc':
          comparison = a[sort] - b[sort];
          break;
        case 'desc':
          comparison = b[sort] - a[sort];
          break;
        default:
          break;
      }
      return comparison;
    });

    // Add productId to each product
    const productsWithIds = sortedProducts.map((product, index) => ({
      ...product,
      productId: index + 1 // Generate productId as index + 1
    }));

    return productsWithIds;
  } catch (error) {
    console.error('Error fetching products:', error.response.data);
    throw new Error('Failed to fetch products');
  }
};

// Route to get top products within a category
app.get('/categories/:categoryName/products', async (req, res) => {
  const { categoryName } = req.params;
  let { topN = 10, minPrice = 0, maxPrice = 1000000, sort, sortOrder = 'asc' } = req.query;
  const page = parseInt(req.query.page) || 1;

  // Convert topN to a number
  topN = parseInt(topN);

  try {
    const products = await fetchProducts('AMZ', categoryName, topN, minPrice, maxPrice, sort, sortOrder);
    
    // Pagination logic
    let paginatedProducts = [];
    const totalProducts = products.length;

    if (topN > 10) {
      // If topN exceeds 10, adjust the pagination
      const startIndex = (page - 1) * 10; // Fixing the items per page to 10
      const endIndex = Math.min(startIndex + 10, totalProducts); // Ensuring endIndex doesn't exceed totalProducts
      paginatedProducts = products.slice(startIndex, endIndex);
    } else {
      // Otherwise, use the regular pagination logic
      const startIndex = (page - 1) * topN;
      const endIndex = startIndex + topN;
      paginatedProducts = products.slice(startIndex, endIndex);
    }

    res.json(paginatedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Route to get details of a specific product
app.get('/categories/:categoryName/products/:productId', async (req, res) => {
  const { categoryName, productId } = req.params;

  try {
    const products = await fetchProducts('AMZ', categoryName, 1, 0, Infinity);
    const product = products.find(p => p.productId === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
