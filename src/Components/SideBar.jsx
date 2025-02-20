import { useState } from 'react'
import React from 'react'
import menu from '../assets/menu.svg'

function SideBar() {
    const [active, setActive] = useState(false)

    const toggleActive = () => {
        setActive(!active ? true : false)
    }
  return (
    <div className={`bg-slate-200 ${!active ? "w-1/4": "w-[15vh]"} min-h-full`}>
        <div className=" flex items-center justify-start p-3 m-5 hover:bg-slate-300 hover:w-[70px] hover:rounded-[50%] ">
            <img src={menu} alt="" className="w-[45px] h-[45px] " onClick={toggleActive}/>
        </div>
    </div>
  )
}

export default SideBar