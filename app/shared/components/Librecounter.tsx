import React from 'react'

const Librecounter: React.FC = () => {
  return (
    <a href="https://librecounter.org/referer/show" target="_blank" className="inline-block align-middle mr-2 ml-2">
      <img
        src="https://librecounter.org/counter.svg"
        referrerPolicy="unsafe-url"
        alt="Visitor counter"
        className="w-4 h-auto"
        width={16}
        height={16}
      />
    </a>
  )
}

export default Librecounter
