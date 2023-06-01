import  React, {Component} from 'react';

class UserBadge extends Component {
    constructor(props) {
        super(props);
        this.state = { isHovered: false };
      }
    
      handleMouseEnter = () => {
        this.setState({ isHovered: true });
      };
    
      handleMouseLeave = () => {
        this.setState({ isHovered: false });
      };
    
      render() {
        const { link, img, username } = this.props;
        const { isHovered } = this.state;
        return (
          <div
            className="avatar"
            style={{
                display: "flex",
                flexWrap: "wrap",
                flexBasis: "min-content",
                justifyContent: "center",
                width: "fit-content",
              padding: "1vw",
              margin: "1vw",
              background: isHovered ? "rgb(238 249 253 / 46%)" : "none",
              borderRadius: "10px",
              borderStyle: isHovered ? "inset" : "unset",
              borderColor: isHovered ? "rgb(45, 68, 170)" : ""
            }}

            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <a
              className="avatar__photo-link avatar__photo"
              target="_blank"
              href={link}
              style={{
                display: "block",
                marginRight: "1px",
                border: "1px solid #ccc",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                transition: "all 0.3s ease-in-out",
                transform: isHovered ? "scale(2.1)" : "none"
              }}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            >
              <img
                alt="Badge Winner"
                src={img}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block"
                }}
              />
            </a>
            <a
              href={link}
              target="_blank"
              style={{
                textAlign: "center",
                marginTop: "1vw",
                width: "6rem"
              }}

            >
              {username}
            </a>
          </div>

        )
    }
}

export default UserBadge;
