import { UserButton } from '@clerk/nextjs'
// import { usePathname } from 'next/navigation'
import React from 'react'

const Header = () => {
    // const path = usePathname();
  return (
    <div className='flex p-4 items-center justify-between bg-secondary'> 
        <img src={'/logo.svg'} width={160} height={100} alt='logo'></img>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer 
           `}>Dashboard</li>
            <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>Questions</li>
            <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>Upgrade</li>
            <li className='hover:text-primary hover:font-bold transition-all cursor-pointer'>How it Works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default  Header