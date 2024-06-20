import { Component } from 'react'
import './badges.css'

class UserBadge extends Component {
    constructor(props) {
        super(props)
        this.state = { isHovered: false }
    }

    handleMouseEnter = () => {
        this.setState({ isHovered: true })
    }

    handleMouseLeave = () => {
        this.setState({ isHovered: false })
    }

    render() {
        const { link, img, username } = this.props
        const { isHovered } = this.state
        return (
            <div
                className="avatar badge"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
            >
                <a
                    className="avatar__photo-link avatar__photo badge-link"
                    target="_blank"
                    href={link}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <img alt="Badge Winner" src={img} />
                </a>
                <a href={link} target="_blank">
                    {username}
                </a>
            </div>
        )
    }
}

export default UserBadge
