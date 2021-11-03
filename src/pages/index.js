import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "Getting Started",
    imageUrl: "img/getting-started.svg",
    url: "/docs/",
    description: (
      <>
        A step-by-step guide on how to get started with DHIS2 application
        development.
      </>
    ),
  },
  {
    title: "DHIS2 App Platform",
    imageUrl: "img/app-platform.svg",
    url: "/docs/tutorials/",
    description: (
      <>
        Common build system, development tools, runtime support, and standard
        functionality for DHIS2 apps.
      </>
    ),
  },
  {
    title: "Components & Libraries",
    imageUrl: "img/components.svg",
    url: "/docs/tutorials/",
    description: (
      <>
        Learn more about the DHIS2 UI components, analytics helper functions the
        SMS library.
      </>
    ),
  },
];

function Feature({ imageUrl, url, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
      <p>
        <a href={url}>Learn more →</a>
      </p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Welcome to the ${siteConfig.title}`}
      description="This portal serves as essential resources for developers building web applications upon the DHIS2 platform. You can find additional documentation, how-to-guides, information on events and blog posts."
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--secondary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
