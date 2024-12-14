import React from "react";

const Reviews = () => {
  const reviews = [
    {
      name: "Emily",
      feedback: "Fresh and delicious seafood. Highly recommended!",
    },
    {
      name: "James",
      feedback: "Great service and quality products.",
    },
  ];

  return (
    <section className="bg-blue-50 py-12 px-6">
      <h2 className="text-2xl font-bold text-center mb-8">Our Customers Review</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg"
          >
            <p className="italic">"{review.feedback}"</p>
            <h4 className="mt-4 text-right font-bold">- {review.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;
