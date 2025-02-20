import React from 'react'
import menu from '../assets/menu.svg'

function SideBar() {
  return (
    <div className='bg-slate-200 w-1/4 min-h-full'>
        <div className="h-[15vh] flex items-center justify-start p-3">
            <img src={menu} alt="" className="w-[45px] h-[45px]" />
        </div>
    </div>
  )
}

export default SideBar