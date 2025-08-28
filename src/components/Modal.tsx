import { ReactNode } from 'react'
export default function Modal({open,onClose,children}:{open:boolean,onClose:()=>void,children:ReactNode}){
  if(!open) return null
  return <div className="fixed inset-0 bg-black/60 grid place-items-center z-50" onClick={onClose}>
    <div className="card max-w-lg w-[92vw]" onClick={e=>e.stopPropagation()}>{children}</div>
  </div>
}