import React from "react";

const Features = () => {
  const features = [
    "Fast Delivery",
    "Premium Quality",
    "Fresh Products",
  ];

  return (
    <section className="flex justify-center space-x-8 py-8 bg-gray-50">
      {features.map((feature, index) => (
        <div
          key={index}
          className="text-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg"
        >
          <h3 className="text-lg font-semibold text-blue-600">{feature}</h3>
        </div>
      ))}
    </section>
  );
};

export default Features;
