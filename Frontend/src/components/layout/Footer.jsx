import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-black z-50 border-t-1 shadow-xl p-4 text-white">
      {/* socials */}
      <div className="flex flex-col items-center justify-center gap-4 mt-4 mb-6">
        <div className="font-semibold">Follow Us</div>
        <div className="flex justify-center items-center gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            className="p-3 bg-white rounded-full"
          >
            <Facebook className="text-black hover:text-red-500" size={26} />
          </a>
          <a
            href="https://x.com"
            target="_blank"
            className="p-3 bg-white rounded-full"
          >
            <Twitter className="text-black hover:text-red-500" size={26} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            className="p-3 bg-white rounded-full"
          >
            <Instagram className="text-black hover:text-red-500" size={26} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            className="p-3 bg-white rounded-full"
          >
            <Youtube className="text-black hover:text-red-500" size={26} />
          </a>
        </div>
      </div>

      {/* quick links */}
      <div className="flex flex-col justify-center items-center gap-4 my-4">
        <div className="font-semibold">Quick Links</div>
        <div className="flex justify-between items-center gap-2 sm:gap-10 flex-col sm:flex-row">
          <Link to="/" className="hover:text-red-500">
            Home
          </Link>
          <Link to="/product" className="hover:text-red-500">
            Order now
          </Link>
          <Link to="/about" className="hover:text-red-500">
            About Us
          </Link>
          <Link to="/contact" className="hover:text-red-500">
            Contact
          </Link>
        </div>
      </div>

      <p className="flex flex-col sm:flex-row justify-center items-center mt-8 mb-2">
        Copyright ©2025: Designed by
        <span className="font-semibold ml-3 tracking-[6px]">ADITYA</span>
      </p>
    </footer>
  );
};

export default Footer;
