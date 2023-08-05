import React, { Component } from 'react';
import Winners from './Winners.js';
import Year2023 from './Year2023.js';
import Year2022 from './Year2022.js';
import Year2021 from './Year2021.js';
import Year2020 from './Year2020.js';

class AppWinners extends Component {
    render() {
        return (
            <div id="wrapper">
                <div id="main">
                <Winners/>
                <Year2023/>
                <Year2022/>
                <Year2021/>
                <Year2020/>
                </div>
            </div>
        );
    }
}

export default AppWinners;
