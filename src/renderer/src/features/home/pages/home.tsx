// import img from "../../../assets/play-btn-img.png"
import { useState, useEffect } from 'react';
import styles from '../styles/style.module.css'
// import { Link } from 'react-router-dom';
import PlayButton from '../features/playButton/playButton';
import Blog from '../features/blog/blog';
import ProgressBar from '../features/progressBar/progressBar';
import CustomSelect from '@renderer/components/CustomSelect/CustomSelect';
import LogInButton from '../features/logInButton/logInButton';

function Home(): React.JSX.Element {


  return (
    <>
      <div className={styles.main_wrapper}>
        <div className={styles.blog_box}>
          <Blog></Blog>
        </div>
      </div>

      {/* <ProgressBar></ProgressBar> */}
    </>
  )
}

export default Home
