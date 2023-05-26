import React, {Component} from 'react';
import { BadgeList } from './BadgeList';

class Badgepage extends Component  {
    constructor(){
        super();
        this.state = {
            attendees: [],
            badge: {}
        }
    }

    componentDidMount(){
        fetch("https://community.dhis2.org/user_badges.json?badge_id=118")
        .then(response => {return response.json()})
        .then(result =>{this.setState({attendees:result.users})})
        .catch(error => console.log('error', error));
        fetch("https://community.dhis2.org/user_badges.json?badge_id=118")
        .then(response => {return response.json()})
        .then(result =>{this.setState({badge:result.badges[0]})})
        .catch(error => console.log('error', error));
    }

    render(){
        const listAttendees = this.state.attendees;
        const badgeInfo = this.state.badge;
        
    return (
        <>
        <h1 style={{alignSelf:"center"}}>Developer Meetup Attendees</h1>
        <BadgeList attendees={listAttendees} info={badgeInfo} />
        </>
    )
}
}

export default Badgepage;
