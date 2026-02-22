'use client';

import styles from './mytools.module.css';
import Conception from '../Conception/conception';
import BackEnd from '../BackEnd/backend';
import FrontEnd from '../FrontEnd/frontend';

export default function MyTools() {

  return (
    <section id="tools" className={styles.sectionMyTools}>
      <div className={styles.container}>
        <Conception />
        <BackEnd />
        <FrontEnd />
        {/* <p>Front React</p>
        <p>Sonarqube</p>
        <p>CI/CD</p>
        <p>Monitoring</p> */}
      </div>
    </section>
  );
}
