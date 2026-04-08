import { addNotification } from "@renderer/features/overlay/notification/features/notificationList";
import styles from "./styles.module.css"
import * as cheerio from 'cheerio';
import { useEffect, useState } from "react";

function Blog({}): React.JSX.Element {
    type BlogArticle = {
        headerHtml: string;
        contentHtml: string;
    };

    const [articles, setArticles] = useState<BlogArticle[]>([]);
    useEffect(() => {
        const getBlogData = async () => {
            const res = await window.api.getRequest('https://www.vintagestory.at/blog.html/');
            // TODO: error if blog can't load
            const $ = cheerio.load(res);

            const parsedArticles: BlogArticle[] = $("article.cCmsCategoryFeaturedEntry")
            .map((_, el) => {
                const article = $(el);

                return {
                    headerHtml: article.find("header").html() || "",
                    contentHtml: article.children("div").first().html() || "",
                };
            })
            .get();

            setArticles(parsedArticles);
            // const articles = $('.cCmsCategoryFeaturedEntry');
            // console.log(articles);
        };
        getBlogData();
    }, []);

    const handleExternalLinks = async (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest("a");

        if (!anchor) return;

        let href = anchor.getAttribute("href");
        if (!href) return;

        if (href.startsWith("/")) {
            href = `https://www.vintagestory.at${href}`;
        }

        if (href.startsWith("http://") || href.startsWith("https://")) {
            e.preventDefault();
            await window.api.openExternalLink(href);
        }
    };
    
    return(
        <div className={styles.blog_box}>
        
            {articles ? articles.map((article, index) => (
                <div className={styles.blog} onClick={handleExternalLinks}>
                    <div key={index} className={styles.article_box}>
                        <div className={styles.blog_header} dangerouslySetInnerHTML={{ __html: article.headerHtml }} />
                        <div className={styles.blog_body} dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
                    </div>
                </div>
            )) : <></>}
            
        </div>
    )
}

export default Blog