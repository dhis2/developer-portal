import React from 'react';
import Badge from './Badge';

export const BadgeList = ({attendees}) => {
    return(
        <>
      <div
          style={{
            display: 'flex',
            flexWrap: "wrap",
            justifyContent: "center",
          }}>
        {
            attendees.map((user,i) => {
    return (
<Badge
        key={attendees[i].id}
        username={attendees[i].username}
        img={"https://dhis2.b-cdn.net/" + attendees[i].avatar_template.replace('{size}','120')}
        link={"https://community.dhis2.org" + attendees[i].assign_path.replace('/activity/assigned','')}
        />
    );
    })
    }
</div>
</>
)

}
