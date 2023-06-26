import React, { Component } from 'react';
import Winners from './Winners.js';
import Year2023 from './Year2023.js';
import Year2022 from './Year2022.js';
import Year2021 from './Year2021.js';
import Year2020 from './Year2020.js';

class AppWinners extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'Winners',
            /* Add a new year for each new year */
            winnersList: {
                2023: Year2023,
                2022: Year2022,
                2021: Year2021,
                2020: Year2020
            },
            className: 'tabs__item--active'
        };
    }

    handleNavClick = (component, event) => {
        this.setState({ display: component });
        const tabs = document.querySelectorAll('.tabs__item');
        tabs.forEach(tab => tab.classList.remove(this.state.className));
        event.currentTarget.parentNode.classList.add(this.state.className);
    }

    render() {
        const { display, winnersList } = this.state;
        const Year = winnersList[display] ? winnersList[display] : Winners;
        return (
            <div id="wrapper">
                <ul className="tabs tabs--block">
                    {/*
                    Add a new li for each new year
                    When years get too many, suggestion to leave older years in a Dropdown at the end such as (https://infima.dev/docs/components/dropdown)
                    */}
                    <li className="tabs__item tabs__item--active"><a href="#winnersMain" onClick={(event) => this.handleNavClick('Winners', event)}><span>App Competition</span></a></li>
                    <li className="tabs__item"><a href="#2023" onClick={(event) => this.handleNavClick('2023', event)}><span>2023</span></a></li>
                    <li className="tabs__item"><a href="#2022" onClick={(event) => this.handleNavClick('2022', event)}><span>2022</span></a></li>
                    <li className="tabs__item"><a href="#2021" onClick={(event) => this.handleNavClick('2021', event)}><span>2021</span></a></li>
                    <li className="tabs__item"><a href="#2020" onClick={(event) => this.handleNavClick('2020', event)}><span>2020</span></a></li>
                </ul>
                <div id="main">
                    <Year />
                </div>
            </div>
        );
    }
}

export default AppWinners;
