import React from "react";
import Layout from "@theme/Layout";

const events = [
  {
    title: "Introduction Webinar",
    date: "February 8, 2021 @ 14:00 CET",
    description: (
      <>
        This high-level webinar includes a non-technical overview of the
        Application Platform, Android SDK, and developer outreach initiatives at
        DHIS2. It will also cover the progress made in 2020, the current state
        of DHIS2 developer tools and more.
      </>
    ),
  },
  {
    title: "Developer Academy - Workshop 1",
    date: "March 17, 2021 - March 18, 2021",
    description: (
      <>
        Learn how to build high-quality, maintainable DHIS2 applications using
        the latest tools from the core team in this hands-on 2-day workshop.
        This workshop will be a combination of presented material and hands-on
        development time. Each participant will build their own DHIS2
        application by the end of the course.
      </>
    ),
  },
  {
    title: "Developer Academy - Workshop 2",
    date: "May 4, 2021 - May 7, 2021",
    description: (
      <>
        This workshop will focus on more advanced topics such as translations,
        the DHIS2 App Hub, stand-alone applications, visualization etc. This
        workshop is targeting advanced users of DHIS2 and is a good opportunity
        to get an in-depth knowledge on how to build high-quality, maintainable
        DHIS2 applications using the latest tools. Successful completion of the
        assignments is one of the prerequisite to earn a DHIS2 certificate at
        the end of the Academy program.
      </>
    ),
  },
];

function Events() {
  return (
    <Layout title="Events">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          fontSize: "20px",
        }}
      >
        <p>
        Edit <code>pages/events.js</code> and save to reload.
        </p>
      </div>
    </Layout>
  );
}

export default Events;
