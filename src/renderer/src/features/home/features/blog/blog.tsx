import styles from "./styles.module.css"
import * as cheerio from 'cheerio';
import { useEffect } from "react";

function Blog({}): React.JSX.Element {
    useEffect(() => {
        const getBlogData = async () => {
            const res = await window.api.getRequest('https://www.vintagestory.at/blog.html/');
            const $ = cheerio.load(res);

            const articles = $('.cCmsCategoryFeaturedEntry');
            // console.log(articles)
        };
        getBlogData();
    }, [])
    
    return(
        <div className={styles.blog_box}>
            <div className={styles.blog}>
                <div className={styles.blog_header}>
                    <div className={styles.blog_header_avatar}>avatar</div>
                    <div className={styles.blog_header_info_box}>
                        <div className={styles.blog_header_info_box_title}>1.22.0-rc.6 - Fishing, Mechanisms, Metalworking and More!</div>
                        <div className={styles.blog_header_info_box_author}>By Tyron, in News, Saturday at 09:15 AM</div>
                    </div>
                </div>

                <div className={styles.blog_text}>
                    Dear Extraordinary Survivalists
                    v1.22.0-rc.4, an unstable release, can now be downloaded through the account manager.

                    The road to stable continues. #2
                </div>
            </div>


            <div className={styles.blog}>
                <div className={styles.blog_header}>
                    <div className={styles.blog_header_avatar}>avatar</div>
                    <div className={styles.blog_header_info_box}>
                        <div className={styles.blog_header_info_box_title}>1.22.0-rc.6 - Fishing, Mechanisms, Metalworking and More!</div>
                        <div className={styles.blog_header_info_box_author}>By Tyron, in News, Saturday at 09:15 AM</div>
                    </div>
                </div>

                <div className={styles.blog_text}>
                    Dear Extraordinary Survivalists
                    v1.22.0-rc.4, an unstable release, can now be downloaded through the account manager.

                    The road to stable continues. #2
                </div>
            </div>
        </div>
    )
}

export default Blog