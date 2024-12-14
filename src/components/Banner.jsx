import React from "react";

const Banner = () => {
  return (
    <section className="bg-cover bg-center text-center py-20" style={{ backgroundImage: "url('/path-to-banner-image.jpg')" }}>
      <h1 className="text-4xl font-bold text-white">
        You Can't Buy Happiness, But You Can Buy <span className="text-blue-300">SeaFood</span>
      </h1>
      <button className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600">
        Subscribe
      </button>
    </section>
  );
};

export default Banner;
