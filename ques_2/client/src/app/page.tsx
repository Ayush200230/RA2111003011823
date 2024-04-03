"use client";
import React, { useState } from "react";
import axios from "axios";
import ProductPreview from "../components/productPreview";

const Home = () => {
  const [formData, setFormData] = useState({
    productCategory: "",
    topN: "10",
    minPrice: "",
    maxPrice: "",
    sort: "rating",
    sortOrder: "desc",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5173/categories/${formData.productCategory}/products?topN=${formData.topN}&minPrice=${formData.minPrice}&maxPrice=${formData.maxPrice}&sort=${formData.sort}&sortOrder=${formData.sortOrder}&page=1`
      );
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching products");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label htmlFor="productCategory">Product Category:</label>
        <select
          name="productCategory"
          id="productCategory"
          value={formData.productCategory}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="laptop">Laptop</option>
          <option value="mouse">Mouse</option>
        </select>

        <label htmlFor="topN">Top Products:</label>
        <select
          name="topN"
          id="topN"
          value={formData.topN}
          onChange={handleChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>

        <label htmlFor="minPrice">Min Price:</label>
        <input
          type="number"
          name="minPrice"
          id="minPrice"
          value={formData.minPrice}
          onChange={handleChange}
        />

        <label htmlFor="maxPrice">Max Price:</label>
        <input
          type="number"
          name="maxPrice"
          id="maxPrice"
          value={formData.maxPrice}
          onChange={handleChange}
        />

        <label htmlFor="sort">Sort By:</label>
        <select
          name="sort"
          id="sort"
          value={formData.sort}
          onChange={handleChange}
        >
          <option value="rating">Rating</option>
          <option value="price">Price</option>
          <option value="discount">Discount</option>
        </select>

        <label htmlFor="sortOrder">Sort Order:</label>
        <select
          name="sortOrder"
          id="sortOrder"
          value={formData.sortOrder}
          onChange={handleChange}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button type="submit">Fetch Products</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {products.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {products.map((product: any) => (
            <ProductPreview key={product.productId} {...product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
