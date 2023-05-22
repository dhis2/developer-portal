import  React, {Component} from 'react';

class Badge extends Component {
    render(){
        const {link,img,username} = this.props;
        return(
            <>
            <div class="card-demo">
                <div class="card">
            <div className="card  avatar avatar--vertical" style={{padding:"3vw",margin:"1vw", width:"15rem",alignContent:"center"}}>
                <a className="card__image avatar__photo-link  avatar__photo avatar__photo--xl"
                href={link}>
                <img
                alt="Developer Meetup Attendee"
                src={img} />
                </a>
                <div class="card__body">
                <h2>{username}</h2>
                </div>
                <div class="card__footer"><a href={link}>
      <button class="button button--primary button--block">View Community Profile</button></a>
    </div>
                </div>
                </div>
                </div>
            </>
        )
    }
}

export default Badge;
