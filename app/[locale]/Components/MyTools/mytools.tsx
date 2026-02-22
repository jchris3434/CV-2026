'use client';

import styles from './mytools.module.css';
import Conception from '../Conception/conception';
import BackEnd from '../BackEnd/backend';
import FrontEnd from '../FrontEnd/frontend';
import DevOps from '../DevOps/devops';

export default function MyTools() {

  return (
    <section id="tools" className={styles.sectionMyTools}>
      <div className={styles.container}>
        <Conception />
        <BackEnd />
        <FrontEnd />
        <DevOps />
      </div>
    </section>
  );
}
