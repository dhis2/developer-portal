import React, {Component} from 'react';

class Year2022 extends Component {
    render() {
        return(
        <div className="row row--no-gutters">
        <div className="col">
            <div className="col-demo">
                <div className="card-demo">
                    <div className="card">
                        <div className="hero hero--primary" style={{height: '25rem'}}>
                            <div className="container">
                                <h1 className="hero__title">App Name</h1>
                                <p className="hero__subtitle">App Short Description</p>
                            </div>
                        </div>
                        <div className="card__header">
                            <div className="avatar">
                                <img
                                    className="avatar__photo"
                                    src="https://ugc.padletcdn.com/uploads/padlet-uploads/1227681803/59a58d56de2d9cd7c6d1e309fd82ee33/image.png?token=ZVIgB0nBlvXUZ5xB94h9X2LN_y0Z16SEeoDReR6kmVleP0bwALRAC6ZyClXNkOAHlqgCJuh_4pD_eqRZQ9ZYcEljkK4__Ny3yc8nUYIu64ggVzJWDUdjt0ZyNnxD97mYf7srsHQKJdmKrjwIYIbBD1PLItxYLiXseGUfqCJgoTVx7yMWetEVk14FLxuEorqvD1is17pxkSEGdI1HbMlUhkxrUwdGzwJynax3ulyOW3Q=" alt="Eric Chingalo" />
                                <div className="avatar__intro">
                                    <div className="avatar__name">Winner Name</div>
                                    <small className="avatar__subtitle">
                                        Description such as title, or organization name
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="card__footer">
                            <div className="button-group button-group--block">
                                <button className="button button--secondary">Profile</button>
                                <button className="button button--secondary">App Description</button>
                                <button className="button button--secondary">Download</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
        )}
}

export default Year2022;