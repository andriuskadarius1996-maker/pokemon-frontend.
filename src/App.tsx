import React from "react"; import "./styles.css";
type Manifest = Record<string, string>;
export default function App(){const [m,setM]=React.useState<Manifest>({});
React.useEffect(()=>{fetch('/avatars_manifest.json').then(r=>r.json()).then(setM)},[]);
const url=m["1"]; return <div className='page'><h1>Avatars (preview)</h1>
<div className='grid'><div className='card sparko'><div className='fx'></div>
{url && <img className='char' src={url} alt='lv01'/>}<div className='label'>lv01</div></div></div></div>}