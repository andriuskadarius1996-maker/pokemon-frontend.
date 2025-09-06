type Props = { src:string; label?:string };
export default function AvatarAnimated({src,label}:Props){
  return (
    <div className="flex flex-col items-center">
      <img src={src} alt={label||'avatar'} className="w-16 h-16 object-contain glow"/>
      {label && <div className="badge mt-2">{label}</div>}
    </div>
  );
}