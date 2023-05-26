import  React, {Component} from 'react';

class UserBadge extends Component {
    render(){
        const {link,img,username} = this.props;
        return(
            <>
            <div className="card avatar--vertical"
            style={{overflowWrap:"anywhere", padding:"1vw",margin:"1vw", width:"13rem", height:"13rem",display:"flex",justifyContent:"space-around"}}>
                <a className="card__image avatar__photo-link  avatar__photo" target="_blank"
                href={link}>
                <img
                alt="Developer Meetup Attendee"
                src={img} />
                </a>
                <a style={{textAlign:"center"}}>{username}</a>
                <a href={link} target="_blank">
      <button className="button button--sm button--secondary">View Community Profile</button></a>
                </div>
            </>
        )
    }
}

export default UserBadge;
