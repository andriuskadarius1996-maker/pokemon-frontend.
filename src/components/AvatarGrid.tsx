import React from 'react';
import type { Avatar } from '../utils';

export default function AvatarGrid({ avatar, imgUrl }:{ avatar: Avatar, imgUrl: string }){
  return (
    <div className="avatar">
      <img src={imgUrl} alt={avatar.name} />
      <div className="badge">{avatar.name} • Lv.{avatar.level}</div>
    </div>
  );
}
