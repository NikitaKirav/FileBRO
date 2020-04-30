import Directories from './Components/Directories';
import imageService from './image-service';
import Files from './Components/Files';
import modalWindow from './Components/ModalWindow';
import navigation from './Components/Navigation';
import './Styles/style.less';
import {
    folderElement, remoteFileButton, renameFileButton, moveFileButton,
    copyFileButton, createFolderButton, renameFolderButton, remoteFolderButton,
    leftPart, rightPart, imageElement, downloadFile, getUrlOfFolder, getFolderProperties,
} from './dom';

const directories = new Directories();

folderElement.addEventListener('click', e => {
    const files = new Files();
    const folderProperty = getFolderProperties(e);
    const topElementOfTree = leftPart;
    directories.openFolderShowFiles(folderProperty, topElementOfTree);
    const url = getUrlOfFolder(folderProperty);
    files.getFiles(url);
});

remoteFileButton.addEventListener('click', e => {
    modalWindow.openModalRemoteFiles();
});

renameFileButton.addEventListener('click', e => {
    modalWindow.openModalRenameFile();
});

moveFileButton.addEventListener('click', function () {
    modalWindow.openModalMoveFiles();
});

copyFileButton.addEventListener('click', function () {
    modalWindow.openModalCopyFiles();
});

createFolderButton.addEventListener('click', function () {
    modalWindow.openModalCreateFolder();
});

renameFolderButton.addEventListener('click', function () {
    modalWindow.openModalRenameFolder();
});

remoteFolderButton.addEventListener('click', function () {
    modalWindow.openModalRemoteFolder();
});

leftPart.addEventListener('click', function () {
    navigation.makeActiveLeftPart();
});

rightPart.addEventListener('click', function () {
    navigation.makeActiveRightPart();
});

imageElement.addEventListener('click', e => {
    navigation.makeActiveFile(e);
});

downloadFile.addEventListener('change', function () {
    const activeDirectory = document.querySelector('.activeFolder');
    const dir = activeDirectory.querySelector('a').title;
    imageService.uploaFile(this.files[0], dir);
    downloadFile.value = "";
});



