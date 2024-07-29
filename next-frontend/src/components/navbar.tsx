import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-end my-2">
        <span className="px-4 cursor-pointer text-sm">Help</span>
        <span className="px-4 cursor-pointer text-sm">Orders & Returns</span>
        <span className="px-4 cursor-pointer text-sm">Hi, John</span>
      </div>
      <div className="flex justify-between items-center w-full px-5 py-4">
        <h2 className="text-2xl font-bold">ECOMMERCE</h2>
        <div className="flex justify-between items-start">
          <span className="bg-transparent border-none m-0.5 p-0.5 px-2 font-semibold">Categories</span>
          <span className="bg-transparent border-none m-0.5 p-0.5 px-2 font-semibold">Sale</span>
          <span className="bg-transparent border-none m-0.5 p-0.5 px-2 font-semibold">Clearance</span>
          <span className="bg-transparent border-none m-0.5 p-0.5 px-2 font-semibold">New stock</span>
          <span className="bg-transparent border-none m-0.5 p-0.5 px-2 font-semibold">Trending</span>
        </div>
        <div className="flex items-center">
          <SearchIcon />
          <span className="cursor-pointer ml-4">
            <ShoppingCartIcon />
          </span>
        </div>
      </div>
      <div className="bg-gray-200 text-center text-sm font-semibold py-2 my-2 w-full">
        Get 10% off on business sign up
      </div>
    </div>
  );
};
