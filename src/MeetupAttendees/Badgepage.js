import React, {Component} from 'react';
import { BadgeList } from './BadgeList';

class Badgepage extends Component  {
    constructor(){
        super();
        this.state = {
            attendees: []
        }
    }

    componentDidMount(){
        fetch("https://community.dhis2.org/user_badges.json?badge_id=118")
        .then(response => {return response.json()})
        .then(attendees =>{this.setState({attendees:attendees.users})})
        .catch(error => console.log('error', error));
    }

    render(){
        const listAttendees = this.state.attendees;
    return (
        <>
        <h1 style={{alignSelf:"center"}}>Developer Meetup Attendees</h1>
        <BadgeList attendees={listAttendees}/>
        </>
    )
}
}

export default Badgepage;
