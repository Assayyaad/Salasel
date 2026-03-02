import React from 'react'
import Image from 'next/image'

const Librecounter: React.FC = () => {
  return (
    <a href="https://librecounter.org/referer/show" target="_blank" className="inline-block align-middle mr-2 ml-2">
      <Image
        src="https://librecounter.org/counter.svg"
        alt="Visitor counter"
        className="w-4 h-auto"
        width={16}
        height={16}
      />
    </a>
  )
}

export default Librecounter
