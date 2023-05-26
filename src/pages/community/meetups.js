import React from 'react'
import Layout from '@theme/Layout'
import Badgepage from '../../MeetupAttendees/Badgepage';

function Attendees() {
    return (
        
       <Layout title="Badges" description="Developer Meetup Attendees">
       <Page></Page>
        </Layout>
        
        
    )
}

export const Page = () => (
    <div className="docPage_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-styles-module">
    <aside className="theme-doc-sidebar-container docSidebarContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-Sidebar-styles-module">
    <div className="sidebarViewport_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-Sidebar-styles-module">
    <div className="sidebar_node_modules-@docusaurus-theme-classic-lib-theme-DocSidebar-Desktop-styles-module">
    <nav aria-label="Docs sidebar" className="menu thin-scrollbar menu_node_modules-@docusaurus-theme-classic-lib-theme-DocSidebar-Desktop-Content-styles-module menuWithAnnouncementBar_node_modules-@docusaurus-theme-classic-lib-theme-DocSidebar-Desktop-Content-styles-module">
    <ul className="theme-doc-sidebar-menu menu__list">
    <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item">
    <a className="menu__link" aria-current="page" href="/community/support">Support</a></li>
    <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item">
    <a className="menu__link" href="/community/stay-connected">Stay connected</a></li>
    <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item">
    <a className="menu__link" href="/community/newsletter">Newsletter</a></li>
    <li className="theme-doc-sidebar-item-category theme-doc-sidebar-item-category-level-1 menu__list-item">
    <div className="menu__list-item-collapsible">
    <a href="#" className="menu__link menu__link--sublist menu__link--sublist-caret" aria-expanded="false">Contributing</a></div>
    <ul className="menu__list">
    <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
    <a className="menu__link" tabIndex="-1" href="/community/contribute-dev-portal">Contribute to the Developer Portal</a></li>
    <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-2 menu__list-item">
    <a className="menu__link" tabIndex="-1" href="/community/contribute">Contribute to the DHIS2 source code</a></li>
    </ul>
    </li>
    <li className="theme-doc-sidebar-item-link theme-doc-sidebar-item-link-level-1 menu__list-item">
    <a className="menu__link menu__link--active" href="/community/meetups">Developer Meetups</a>
    </li></ul>
    </nav>
    </div></div></aside>
    <main className="docMainContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocPage-Layout-Main-styles-module">
    <div className="container padding-top--md padding-bottom--lg">
    <div className="row">
    <section>
    <div className="docItemContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocItem-Layout-styles-module">
    <nav className="theme-doc-breadcrumbs breadcrumbsContainer_node_modules-@docusaurus-theme-classic-lib-theme-DocBreadcrumbs-styles-module" aria-label="Breadcrumbs">
    <ul className="breadcrumbs" itemScope="" itemType="https://schema.org/BreadcrumbList"><li className="breadcrumbs__item">
    <a aria-label="Home page" className="breadcrumbs__link" href="/"><svg viewBox="0 0 24 24" className="breadcrumbHomeIcon_node_modules-@docusaurus-theme-classic-lib-theme-DocBreadcrumbs-Items-Home-styles-module"><path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" fill="currentColor"></path></svg></a></li>
    <li itemScope="" itemProp="itemListElement" itemType="https://schema.org/ListItem" className="breadcrumbs__item breadcrumbs__item--active">
    <span className="breadcrumbs__link" itemProp="name">Developer Meetups</span></li></ul></nav>
    <Badgepage/>
    </div>
    </section>
    </div>
    </div>
    </main>
    </div>
    );

export default Attendees
