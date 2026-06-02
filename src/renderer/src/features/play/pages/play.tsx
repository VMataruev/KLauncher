import styles from "../styles/play.module.css"
import PlayButton from "../features/playButton/playButton"
import ProgressBar from "../features/progressBar/progressBar";
import SelectInstallations from "../features/selectInstallation/selectInstallation";
import character from "@renderer/assets/character.png";
import img_accounts from "../../../assets/game_accounts.png";
import img_wiki from "../../../assets/game_wiki.png";

function Play(): React.JSX.Element {
    const openExternalLink = async (link: string) => {
        await window.api.openExternalLink(link);
    }

    return(
        <>
            <div className={styles.page_wrapper}>
                <img src={character} className={styles.character} alt="" />
                <ProgressBar></ProgressBar>
                <div className={styles.main_box}>
                    <div className={styles.h1}>Vintage Story</div>
                    <div className={styles.span}>Place where fun and creativity begin</div>
                    <div className={styles.buttons_box}>
                        <PlayButton></PlayButton>
                        {/* <select name="installations" id="" value={installationID ?? ""} onChange={ async (e) => {
                            const id = e.target.value;
                            setInstallationID(id);
                            await window.api.setStore('installation_to_start', id);
                        }} 
                        className={styles.installations}>
                            {Object.keys(installations).length > 0 ?
                            Object.values(installations).map(version => (
                            <option value={version.id}>{version.name}</option>
                            ))
                            :
                            <option value=" disabled">Create installation first</option>
                            }
                        </select> */}

                        <SelectInstallations></SelectInstallations>

                    </div>
                </div>
                {/* <div className={styles.vid_box}>
                    <iframe
                    src="https://www.youtube.com/embed/NJjifFq1NGY"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy='strict-origin-when-cross-origin'
                    allowFullScreen
                    />
                    <iframe
                    src="https://www.youtube-nocookie.com/embed/mgvzBB_--xM?si=z2JRDAErFWIseeT2"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy='strict-origin-when-cross-origin'
                    allowFullScreen
                    />
                </div> */}

                <div className={styles.vid_box}>
                    <div className={`${styles.bloc_box} ${styles.block_box_editions}`} onClick={() => {openExternalLink("https://www.vintagestory.at/store/category/1-game-account-game-servers/")}}>
                        <img src={img_accounts} className={styles.block_img} alt="" />
                        <div className={styles.bloc_text}>Game Account & Game Servers</div>
                    </div>

                    <div className={`${styles.bloc_box} ${styles.block_box_forum}`} onClick={() => {openExternalLink("https://wiki.vintagestory.at/Main_Page")}}>
                        <img src={img_wiki} className={styles.block_img} alt="" />
                        <div className={styles.bloc_text}>Vintage Story Wiki</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Play