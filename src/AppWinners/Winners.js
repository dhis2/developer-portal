import React, { Component } from 'react';

class Winners extends Component {
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h2 className="heading">The DHIS2 App Competition</h2>
                        <p>The app competition has been and is one of the most important events for the DHIS2 Developers during the DHIS2 Annual Conference. Each year the developers in the DHIS2 Community are asked to submit their applications and a number of finalists are selected by the DHIS2 core-team. During the DHIS2 Annual Conference the voting is open for all the community to vote for the best app. ... (draft description)</p>
                        <div className="alert alert--info">App Competition submissions for DHIS2 Annual Conference 2024 will be open in May 2024 after an announcement release</div>
                    </div>
                    </div>
                <div className="row">
                <h2 className="heading padding-top--lg">The DHIS2 App Competition Winners Badge</h2>
                    <div className="col col--6 padding-top--lg">
                        <img src="https://dhis2.b-cdn.net/uploads/default/original/3X/e/c/ec15f88a16f7560850388cd26dfa9455c84575f4.png" alt="Badge" className="thumbnail" />
                        <p>App Winner Badge (Web)</p>
                        <a href="https://community.dhis2.org/badges/110/web-app-winner" className="button"><span class="badge badge--secondary padding--md">View all badge winners</span></a>
                    </div>
                    <div className="col col--6 padding-top--lg">
                        <img src="https://dhis2.b-cdn.net/uploads/default/original/3X/7/f/7fc3c670a8eae17016b22d03857be427809cce54.png" alt="Badge" className="thumbnail" />
                        <p>App Winner Badge (Android)</p>
                        <a href="https://community.dhis2.org/badges/111/android-app-winner" className="button"><span class="badge badge--secondary padding--md">View all badge winners</span></a>
                    </div>
                </div>
            </div>
        )
    }
}

export default Winners