"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductPreview from "../../components/productPreview";

const ProductPage: React.FC<{ productId: string }> = ({ productId }) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5173/categories/Laptop/products/${productId}`
        );
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching product data");
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  return (
    <div className="container mx-auto mt-8">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ProductPreview
          productName={product.productName}
          price={product.price}
          rating={product.rating}
          discount={product.discount}
          availability={product.availability}
          productId={product.productId}
        />
      )}
    </div>
  );
};

export default ProductPage;
