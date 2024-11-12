import { Navigate } from "react-router-dom";
import { useState,useEffect } from "react";
import { createContext } from "react";
export const RoleContext=createContext();

export const PrivateRoute = ({  children }) => {
    const [isAuthenticated,setauthen]=useState(false)
    const [loading, setLoading] = useState(true);
    const [role,setrole]=useState('')
    const getData=async()=>{
    try {
      const res=await fetch(process.env.api+'/auth/user-type',{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
        },
        credentials:"include"
      })
      const data=await res.json() 
      
      if(res.ok){
         setauthen(true)
         setrole(data.userType)
      }
    } catch (error) {
        console.log(error)
        setauthen(false)
    }
    finally{
        setLoading(false)
    }
  }
  useEffect(()=>{
     getData()
     console.log(isAuthenticated)
  },[])
  if(loading){
    return (<>
       <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="mt-4 text-indigo-600">Loading ...</p>
        </div>
      </div>
    </>)
  }

  
  return (
    <RoleContext.Provider value={role}>
      {isAuthenticated ? children : <Navigate to="/" />}
    </RoleContext.Provider>
  )
};
