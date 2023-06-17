import React from 'react';
import UserBadge from './UserBadge';
import './badges.css'

export const BadgeList = ({attendees,info}) => {
  return(
        <>
<section className="BadgeInfo">
        <div className="avatar avatar--vertical">
  <img
    className="avatar__photo avatar__photo--xl"
    src={info.image_url} />
  <div className="avatar__intro">
    <div className="avatar__name">{info.name} Badge</div>
    <small className="avatar__subtitle">
      {info.description}</small>
      <small className="avatar__subtitle"></small>
      <div className="alert alert--info">  This badge has been granted   <strong>{info.grant_count}</strong> times!</div>
  </div>
</div>
</section>
      <div className="badgeArea">
            {
            attendees.map((user,i) => {
if (user.username != "System-Academy"){ return(
<UserBadge 
        key={user.id}
        username={user.name ?
                user.name.split(' ').length > 2 ?
                user.name.split(' ')[0] + ' ' + user.name.split(' ')[user.name.split(' ').length - 2] + ' ' + user.name.split(' ')[user.name.split(' ').length - 1] 
                :
                user.name : user.username}
        img={"https://dhis2.b-cdn.net/" + user.avatar_template.replace('{size}','120')}
        link={"https://community.dhis2.org" + user.assign_path.replace('/activity/assigned','')}
        />)
    } else {return ''}
})}
</div>
</>
)};
