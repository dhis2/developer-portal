import { Component } from 'react'
import { BadgeList } from './BadgeList'

class Badgepage extends Component {
    constructor() {
        super()
        this.state = {
            attendees: [],
            badge: {},
        }
    }

    componentDidMount() {
        fetch('https://community.dhis2.org/user_badges.json?badge_id=118')
            .then((response) => {
                return response.json()
            })
            .then((result) => {
                this.setState({
                    attendees: result.users
                        /*very random! Kai's suggestion "randomOrder function"*/
                        .map((e) => ({ e, key: Math.random() }))
                        .sort((a, b) => a.key - b.key)
                        .map(({ e }) => e),
                    badge: result.badges[0],
                })
            })
            .catch((error) => console.log('error', error))
    }

    render() {
        const listAttendees = this.state.attendees
        const badgeInfo = this.state.badge
        return (
            <>
                <BadgeList attendees={listAttendees} info={badgeInfo} />
            </>
        )
    }
}

export default Badgepage
