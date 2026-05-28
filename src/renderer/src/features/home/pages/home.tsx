import styles from "../styles/style.module.css"
import * as cheerio from 'cheerio';
import { useEffect, useState } from "react";
import Loader from "@renderer/components/loader/loader";

function Home({}): React.JSX.Element {
    type BlogArticle = {
        headerHtml: string;
        contentHtml: string;
    };

    const [articles, setArticles] = useState<BlogArticle[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);
    
    useEffect(() => {
        const getBlogData = async () => {
            const res = await window.api.getRequest('https://www.vintagestory.at/blog.html/');
            if (!res.success) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // ждем 5 сек
                getBlogData();
                return;
            };
            const $ = cheerio.load(res.res);

            // Добавляем стили ко всем эмодзи через cheerio
            $("img.ipsEmoji").each((_, el) => {
                $(el).addClass("emoji-styled");
                $(el).css({
                    height: "18px",
                    width: "auto",
                    display: "inline-block",
                    verticalAlign: "middle"
                });
            });

            $("iframe").each((_, el) => {
                $(el).addClass("iframe-styled");
                $(el).css({
                    height: "500px",
                    width: "100%",
                });
            });

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
            setIsLoading(false);
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

    const normalizeHtml = (html) => {
        return html
        .replace(
            /src="\/\/(.*?)"/g,
            'src="https://$1"'
        )
        .replace(
            /data-embed-src=/g,
            'src='
        )
    };
    if (isLoading) {return <div className={styles.loader_wrapper}><Loader></Loader></div>}
    return(
        <div className={styles.blog_box}>
        
            {articles ? articles.map((article, index) => (
                <div className={styles.blog} onClick={handleExternalLinks}>
                    <div key={index} className={styles.article_box}>
                        <div className={styles.blog_header} dangerouslySetInnerHTML={{ __html: normalizeHtml(article.headerHtml) }} />
                        <div className={styles.blog_body} dangerouslySetInnerHTML={{ __html: normalizeHtml(article.contentHtml) }} />
                    </div>
                </div>
            )) : <></>}
            
        </div>
    )
}

export default Home