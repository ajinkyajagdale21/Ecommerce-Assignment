"use client"
import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {Navbar} from '../../components/navbar'
import { Login } from "../../api";

const LoginPage = () => {
  const [loginData, setLoginData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const submitLogin = async(e: FormEvent) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
    try{
        const res = await Login(loginData.email,loginData.password)
        console.log(res,"see")
        router.push("/");
    }
    catch (err){
        console.error(err)
    }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <>
    <Navbar/>
    <div className="flex justify-center">
      <div className="border border-gray-300 rounded-2xl w-1/3 p-0 pb-12 px-10 my-6">
        <h2 className="text-center font-bold text-2xl py-6">Login</h2>
        <h4 className="text-center font-bold text-lg my-4">Welcome back to ECOMMERCE</h4>
        <p className="text-center p-0 text-sm">The next-gen business marketplace</p>
        <form onSubmit={submitLogin}>
          <div className="flex flex-col">
            <label htmlFor="email" className="w-full">Email</label>
            <input
              id="email"
              placeholder="Enter"
              className="w-full mt-2 p-2 mb-2 rounded-lg border border-gray-300bor"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="w-full">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter"
              className="w-full mt-2 p-2 mb-2 rounded-lg border border-gray-300"
              onChange={handleInputChange}
            />
          </div>
          <button className="w-full bg-black text-white rounded py-4 mt-6" type="submit">
            LOGIN
          </button>
          <div className="flex justify-center text-sm mt-4">
            <p>Don't have an Account?</p>
            <button type="button" className="font-semibold ml-2 text-black" onClick={() => router.push("/signup")}>
              SIGN UP
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginPage