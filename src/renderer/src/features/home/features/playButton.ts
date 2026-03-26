export const playButton = async (installation_id) => {
    const installation = await window.api.getStore(`installations.${installation_id}`);
    // console.log(res);

    const folder = installation.folder;
    const isFolderEmpty = await window.api.isFolderEmpty(folder);
    if (isFolderEmpty) {
        // download exe
        await window.api.download_and_install_game(installation.version_link, installation.folder);
    };

}