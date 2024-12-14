import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-bold mb-4">About Us</h4>
          <p>Shop the freshest seafood with us!</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Social Links</h4>
          <a href="https://instagram.com" className="block hover:text-blue-400">
            Instagram
          </a>
          <a href="https://facebook.com" className="block hover:text-blue-400">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
