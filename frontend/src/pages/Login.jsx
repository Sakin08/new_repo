import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const {backendUrl,token,setToken}=useContext(AppContext)

  const navigate=useNavigate()

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try{
    if (state === 'Sign Up') {
      const {data}=await axios.post(backendUrl+'/api/user/register',{name,password,email})
      if(data.success){
        localStorage.setItem('token',data.token)
        setToken(data.token)
      }else{
        toast.error(data.message)
      }
    } else{
      const {data}=await axios.post(backendUrl+'/api/user/login',{password,email})
      if(data.success){
        localStorage.setItem('token',data.token)
        setToken(data.token)
      }else{
        toast.error(data.message)
      }
    }
  }catch(error){
    toast.error(error.message)
  }
  }

  useEffect(()=>{
    if(token){
      navigate('/')
    }
  },[token])


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>

        {state === 'Sign Up' && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          {state === 'Sign Up' ? 'Register' : 'Login'}
        </button>

        <p className="text-center text-sm text-gray-600">
          {state === 'Sign Up' ? 'Already have an account?' : 'Don’t have an account?'}{' '}
          <button
            type="button"
            onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
            className="text-blue-600 hover:underline"
          >
            {state === 'Sign Up' ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login