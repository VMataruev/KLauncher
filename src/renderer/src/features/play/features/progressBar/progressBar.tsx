import { useEffect, useRef, useState } from 'react';
import styles from './progressBar.module.css';

function ProgressBar(): React.JSX.Element {
    const [fileName, setFileName] = useState("");
    const [progressFile, setProgressFile] = useState(0);
    const [gameInstallerName, setGameInstallerName] = useState("");
    const [progressGameInstaller, setProgressGameInstaller] = useState(0);
    const [extractGame, setExtractGame] = useState("");
    const [extractGameProgress, setExtractGameProgress] = useState(0);

    const [showFile, setShowFile] = useState(false);
    const [showInstaller, setShowInstaller] = useState(false);
    const [showExtract, setShowExtract] = useState(false);

    const fileTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const installerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const extractTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);





    useEffect(() => {
        if (fileTimeoutRef.current) {
            clearTimeout(fileTimeoutRef.current);
            fileTimeoutRef.current = null;
        }

        if (progressFile > 0 && progressFile < 100) {
            setShowFile(true);
        }

        if (progressFile === 100) {
            setShowFile(true);

            fileTimeoutRef.current = setTimeout(() => {
                setShowFile(false);
                setProgressFile(0);
                setFileName("");
            }, 3000);
        }
    }, [progressFile]);

    useEffect(() => {
        if (installerTimeoutRef.current) {
            clearTimeout(installerTimeoutRef.current);
            installerTimeoutRef.current = null;
        }

        if (progressGameInstaller > 0 && progressGameInstaller < 100) {
            setShowInstaller(true);
        }

        if (progressGameInstaller === 100) {
            setShowInstaller(true);

            installerTimeoutRef.current = setTimeout(() => {
                setShowInstaller(false);
                setProgressGameInstaller(0);
                setGameInstallerName("");
            }, 3000);
        }
    }, [progressGameInstaller]);

    useEffect(() => {
        if (extractTimeoutRef.current) {
            clearTimeout(extractTimeoutRef.current);
            extractTimeoutRef.current = null;
        }

        if (extractGameProgress > 0 && extractGameProgress < 100) {
            setShowExtract(true);
        }

        if (extractGameProgress === 100) {
            setShowExtract(true);

            extractTimeoutRef.current = setTimeout(() => {
                setShowExtract(false);
                setExtractGameProgress(0);
                setGameInstallerName("");
            }, 3000);
        }
    }, [extractGameProgress]);





    useEffect(() => {
        const unsubscribe = window.api.downloadFileProgress((data) => {
            if (data.percent !== undefined) {
                setProgressFile(data.percent);
            }
            if (data.fileName !== undefined) {
                setFileName(data.fileName);
            }
        });

        return () => {
            unsubscribe();
            if (fileTimeoutRef.current) clearTimeout(fileTimeoutRef.current);
        };
    }, []);



    useEffect(() => {
        const unsubscribe = window.api.downloadGameProgress((data) => {
            if (data.percent !== undefined) {
                setProgressGameInstaller(data.percent);
            }
            if (data.fileName !== undefined) {
                setGameInstallerName(data.fileName);
            }
        });

        return () => {
            unsubscribe();
            if (installerTimeoutRef.current) clearTimeout(installerTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        const unsubscribe = window.api.extractGameProgress((data) => {
            if (data.percent !== undefined) {
                setExtractGameProgress(data.percent);
            }
            if (data.fileName !== undefined) {
                setExtractGame(data.fileName);
            }
        });

        return () => {
            unsubscribe();
            if (extractTimeoutRef.current) clearTimeout(extractTimeoutRef.current);
        };
    }, []);

    

    return (
        <>
            {(showFile || showInstaller || showExtract) && (
                <div className={styles.progressBar}>
                    {showFile && (
                        <div className={styles.bar}>
                            <div
                                className={styles.bar_complete}
                                style={{ width: `${progressFile}%` }}
                            ></div>
                            <div className={styles.text_info}>
                                Downloading {fileName}: {progressFile}%
                            </div>
                        </div>
                    )}

                    {showInstaller && (
                        <div className={styles.bar}>
                            <div
                                className={styles.bar_complete}
                                style={{ width: `${progressGameInstaller}%` }}
                            ></div>
                            <div className={styles.text_info}>
                                Downloading {gameInstallerName}: {progressGameInstaller}%
                            </div>
                        </div>
                    )}

                    {showExtract && (
                        <div className={styles.bar}>
                            <div
                                className={styles.bar_complete}
                                style={{ width: `${extractGameProgress}%` }}
                            ></div>
                            <div className={styles.text_info}>
                                Extracting {extractGame}: {extractGameProgress}%
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default ProgressBar;