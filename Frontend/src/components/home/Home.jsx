import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
// import cakeSpinBgImg from "@/assets/cake_spin_bg_image.jpg";
// import festivalLighsCakeBgImg from "@/assets/festival_lights_cake_bg_image.jpg";
import happinessBgImage from "@/assets/happiness_bg_image.jpg";
// import twoHandsCakeBgImage from "@/assets/two_hands_cake_bg_image.jpg";

const Home = () => {
  return (
    <>
      <div>
        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center h-[70vh] flex flex-col items-center justify-center text-center text-white bg-black/50 px-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0)), url(${happinessBgImage})`,
          }}
        >
          {/* <div className="absolute inset-0 bg-black/5 backdrop-blur-sm"></div> */}

          {/* Content */}
          <div className="absolute right-0 w-full max-w-[500px] md:max-w-[700px] top-[15%] z-10 mx-8">
            <h1 className="text-4xl text-right md:text-6xl font-bold mb-4 drop-shadow-lg ">
              Freshly Baked, Delivered with Love
            </h1>
            <p className="absolute max-w-[300px] sm:max-w-[500px] right-0 text-lg text-right w-full md:text-xl mb-6 drop-shadow-md ">
              Indulge in our cheesecakes, cakes, cupcakes, brownies, and
              pastries – straight from the oven to your door.
            </p>
            <Link
              to="/product"
              className="absolute right-0 bottom-[-140%] xs:bottom-[-250%] sm:bottom-[-190%] md:bottom-[-85%] xl:bottom-[-85%]"
            >
              <Button
                size="lg"
                className="bg-red-500 hover:bg-red-600 text-white  xl:text-lg cursor-pointer"
              >
                Order Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container mx-auto py-12 px-6">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Our Favorites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Example Product Card */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <img
                src="https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ5PD3dJCtyrNoaHJM1ejW1nf62w9mD8AaTI6HKPzYmrwkxec52reryqoflWbtMg2vfns2egxA_22cYzl2fde1Ecka-KjPw"
                alt="Cheesecake"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">Classic Cheesecake</h3>
                <p className="text-gray-500 mb-3">
                  Rich, creamy, and freshly baked.
                </p>
                <Link to="/product/1">
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white  cursor-pointer">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>

            {/* Repeat more product cards here */}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gray-100 py-12 px-6">
          <h2 className="text-2xl font-semibold text-center mb-8">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">
                100% Fresh Ingredients
              </h3>
              <p className="text-gray-500 text-sm">
                Only the best quality goes into every cake.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">Same-Day Delivery</h3>
              <p className="text-gray-500 text-sm">
                Get your treats delivered fresh and fast.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">Custom Orders</h3>
              <p className="text-gray-500 text-sm">
                We make it special, just the way you like it.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
