import React from 'react'

export interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout: React.FC<Readonly<RootLayoutProps>> = ({ children }) => {
  return children
}

export default RootLayout
