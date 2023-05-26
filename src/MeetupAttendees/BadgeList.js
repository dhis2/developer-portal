import React from 'react';
import UserBadge from './UserBadge';

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
      <div
          style={{
            display: 'flex',
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
        {
            attendees.map((user,i) => {
if (attendees[i].username != "System-Academy"){ return(
<UserBadge 
        key={attendees[i].id}
        username={attendees[i].name ? attendees[i].name : attendees[i].username}
        img={"https://dhis2.b-cdn.net/" + attendees[i].avatar_template.replace('{size}','120')}
        link={"https://community.dhis2.org" + attendees[i].assign_path.replace('/activity/assigned','')}
        />)
    } else {return ''}
})}
</div>
</>
)};
