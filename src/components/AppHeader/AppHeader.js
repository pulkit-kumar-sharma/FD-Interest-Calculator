import React from 'react';
import PropTypes from 'prop-types';
import styles from './AppHeader.module.css';

const AppHeader = () => (
  <div className={styles.AppHeader}>
    <h1>Fixed Deposite Calculator</h1>
  </div>
);

AppHeader.propTypes = {};

AppHeader.defaultProps = {};

export default AppHeader;
