import React, { Component } from 'react';

class One extends Component {
    render() {
        return (
            <div className="row row--no-gutters">
                <div className="col">
                    <div className="col-demo">
                        <div className="card-demo">
                            <div className="card">
                                <div className="hero hero--primary" style={{height: '25rem'}}>
                                    <div className="container">
                                        <h1 className="hero__title">DHIS2 Analytics Messenger</h1>
                                        <p className="hero__subtitle">DHIS2 Annual Conference 2023 App Competition Winner</p>
                                    </div>
                                </div>
                                <div className="card__header">
                                    <div className="avatar">
                                        <img
                                            className="avatar__photo"
                                            src="https://ugc.padletcdn.com/uploads/padlet-uploads/1227681803/bb64a7d4b81bf069bb57753cd4822a7f/EricChingalo.jpg?token=ZVIgB0nBlvXUZ5xB94h9X2LN_y0Z16SEeoDReR6kmVleP0bwALRAC6ZyClXNkOAHlqgCJuh_4pD_eqRZQ9ZYcEljkK4__Ny3yc8nUYIu64ggVzJWDUdjt0ZyNnxD97mYtjRx3Jd39JjIfVMJVnSzPUhDlJOvEUFLXgWWM1eRjsWSuxPs_CQYPBH2ZIqU6HFb5S-aWhaNgZ_ylKEp-igPRN04jQ9q5A1kzQRrEwzjRJ2PqLyp1qY7Gw9horI-qJYx" alt="Eric Chingalo" />
                                        <div className="avatar__intro">
                                            <div className="avatar__name">Eric Chingalo</div>
                                            <small className="avatar__subtitle">
                                                HISP Tanzania
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div className="card__footer">
                                    <div className="button-group button-group--block">
                                        <a href="https://community.dhis2.org/u/ericchingalo/summary" className="button button--secondary">
                                            <span class="badge badge--secondary padding--md">Profile</span></a>
                                            <a href="https://community.dhis2.org/t/dhis2-analytics-messenger/53477" className="button button--secondary">
                                            <span class="badge badge--secondary padding--md">App Description</span></a>
                                            <a href="" className="button button--secondary">
                                            <span class="">Download</span></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default One