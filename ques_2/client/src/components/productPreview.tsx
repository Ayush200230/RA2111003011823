import React from "react";

interface ProductPreviewProps {
  productName: string;
  price: number;
  rating: number;
  discount: number;
  availability: string;
  productId: number;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({
  productName,
  price,
  rating,
  discount,
  availability,
  productId,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold">{productName}</h2>
      <div className="mt-4">
        <p className="text-gray-700">Price: ${price}</p>
        <p className="text-gray-700">Rating: {rating}</p>
        <p className="text-gray-700">Discount: {discount}%</p>
        <p className="text-gray-700">Availability: {availability}</p>
        <p className="text-gray-700">Product ID: {productId}</p>
      </div>
    </div>
  );
};

export default ProductPreview;
