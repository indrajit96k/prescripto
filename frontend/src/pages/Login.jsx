import React, { useState } from 'react'

const Login = () => {
  const [login, setlogin] = useState("Sign Up"); //signup for new user and login for existing
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [name, setname] = useState("");
  const onsubmithandler = async (event) => {
    console.log(email, password, name);
    event.preventDefault();

  }
  return (
    <form className='min-h-[80vh] flex items-center' onSubmit={onsubmithandler}>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lgj'>
        <p className='text-2xl font-semibold m-auto'>{login === "Sign Up" ? "Create Account" : "Login"}</p>
        <p className='m-auto'>Please {login} to book appointment</p>
        {
          login == "Sign Up" ? <div className='w-full'>
            <p>Full Name</p>
            <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" placeholder='Enter Name' onChange={(e) => setname(e.target.value)} value={name} required />
          </div>
          : null
        }

        <div className='w-full'>
          <p>Email</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" placeholder='Enter Email' onChange={(e) => setemail(e.target.value)} value={email} required />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" placeholder='Enter Password' onChange={(e) => setpassword(e.target.value)} value={password} required />
        </div>
        <button className='bg-indigo-500 text-white w-full py-2 rounded-md text-base'>{login === "Sign Up" ? "Create Account" : "Login"}</button>
        {
          login === "Sign Up" ?
            <p className='m-auto font-semibold'>Already have an account ? <span onClick={() => setlogin("Login")} className='text-indigo-500  cursor-pointer'>Login here</span></p>
            : <p className='m-auto font-semibold'>Create a new account ? <span onClick={() => setlogin("Sign Up")} className='text-indigo-500  cursor-pointer'>Click here</span></p>
        }
      </div>

    </form>
  )
}

export default Login