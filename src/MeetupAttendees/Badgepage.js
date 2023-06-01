import React, { Component } from 'react';
import { BadgeList } from './BadgeList';

class Badgepage extends Component {
    constructor() {
        super();
        this.state = {
            attendees: [],
            badge: {}
        }
    }

    componentDidMount() {
        fetch("https://community.dhis2.org/user_badges.json?badge_id=118")
            .then(response => { return response.json(); })
            .then(result => {
                this.setState(
                { attendees: result.users,
                    badge: result.badges[0] })
            })
            .catch(error => console.log("error", error));
    }

    render() {
        {/*Using sort and Math.Random to randomize the list each time it isdisplayed*/ }
        const listAttendees = this.state.attendees.sort(() => Math.random() - 0.5);
        const badgeInfo = this.state.badge;
        return (
            <>
                <BadgeList attendees={listAttendees} info={badgeInfo} />
            </>
        )
    }
}

export default Badgepage;
