import React from 'react'
import UserBadge from './UserBadge'
import './badges.css'

export const BadgeList = ({ attendees, info }) => {
    return (
        <>
            <section className="BadgeInfo">
                <div className="avatar avatar--vertical">
                    <img
                        className="avatar__photo avatar__photo--xl"
                        src={info.image_url}
                    />
                    <div className="avatar__intro">
                        <div className="avatar__name">{info.name} Badge</div>
                        <small className="avatar__subtitle">
                            {info.description}
                        </small>
                        <div className="alert alert--info">
                            This badge has been granted{' '}
                            <strong>{info.grant_count}</strong> times!
                        </div>
                    </div>
                </div>
            </section>
            <div className="badgeArea">
                {attendees.map((user, i) => {
                    if (user.username != 'System-Academy') {
                        return (
                            <UserBadge
                                key={user.id}
                                username={
                                    user.name
                                        ? ((parts) =>
                                              parts.length > 2
                                                  ? `${parts[0]} ${
                                                        parts[parts.length - 1]
                                                    }`
                                                  : user.name)(
                                              user.name.split(' ')
                                          )
                                        : user.username
                                }
                                img={
                                    'https://dhis2.b-cdn.net/' +
                                    user.avatar_template.replace(
                                        '{size}',
                                        '120'
                                    )
                                }
                                link={`https://community.dhis2.org/badges/118/developer-meetup-attendee?username=${user.username}`}
                            />
                        )
                    } else {
                        return ''
                    }
                })}
            </div>
        </>
    )
}
