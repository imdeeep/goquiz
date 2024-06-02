import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className='flex justify-center'>
        <h1 className='text-center'>
        Made with ♥️ by <Link href="https://www.linkedin.com/in/mandeepyadav27/" target="_blank" className='underline'>Mandeep</Link>
        </h1>
    </div>
  )
}

export default Footer