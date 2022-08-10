import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">
          This will be the book for you if you are: terested in learning Rust, interested in learning compiler technologies,
          or would like to contribute to swc or Rome in the near future.
          <br/><br/>
          The book will be a full tutorial on writing a JavaScript compiler in Rust.
          And the tutorials will be on detailed topics.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            style={{marginRight: "20px"}}
            to="/docs/intro">
            Read the Book
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/blog">
            Read the Tutorials
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="">
      <HomepageHeader />
    </Layout>
  );
}
