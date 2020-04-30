
export const folderElement = document.querySelector('.dirlist', '.folder', '.folder-element');
export const fileExplorer = document.querySelector('#fileExplorer');
export const createFolderButton = document.querySelector('#createFolder');
export const renameFolderButton = document.querySelector('#renameFolder');
export const remoteFolderButton = document.querySelector('#remoteFolder');
export const chooseFileButton = document.querySelector('#chooseFile');
export const copyFileButton = document.querySelector('#copyFile');
export const moveFileButton = document.querySelector('#moveFile');
export const renameFileButton = document.querySelector('#renameFile');
export const remoteFileButton = document.querySelector('#remoteFile');
export const downloadFile = document.querySelector('#uploadFile');
export const imageElement = document.querySelector('#fileExplorer','.image-element');
export const leftPart = document.querySelector('.left');
export const rightPart = document.querySelector('.right');

export function getActiveFiles() {
    return document.querySelectorAll('.activeFile');
}

// Get a List of Image Elements of the right part 
export function getImageElements(e) {
    return findElement(e, 'image-element');
}

export function getNameActiveFile() {
    return document.querySelector('.activeFile').querySelector('img').title;
}

export function getNameActiveFolder(topElementOfTree) {
    return topElementOfTree.querySelector('.activeFolder').querySelector('.folder-name').innerHTML;
}

export function getActiveFolderProperty(topElementOfTree) {
    return topElementOfTree.querySelector('.activeFolder');
}

export function getFolder(folderProperty) {
    return folderProperty.parentElement;
}

export function getParentOfFolder(folderProperty) {
    return folderProperty.parentElement.parentElement.parentElement;
}

export function getFolderProperty(folder) {
    return folder.querySelector('.folder-element');
}

export function getMaginLeftOfFolder(folderProperty) {
    const a = folderProperty.querySelector('a');
    return a.style.marginLeft;
}

export function changeUrlOfFolder(folderProperty, url) {
    const a = folderProperty.querySelector('a');
    a.title = url;
}

export function changeNameOfFolder(folderProperty, nameNew) {
    const text = folderProperty.querySelector('.folder-name');
    text.innerHTML = nameNew;
}

export function getUrlOfFolder(folderProperty) {
    const a = folderProperty.querySelector('a');
    return a.title;
}

export function getUrlOfActiveFolder(topElementOfTree) {
    const a = getActiveFolderProperty(topElementOfTree).querySelector('a');
    return a.title;
}

export function getFolderProperties(e) {
    return findElement(e, 'folder-element');
}

export function getNamesActiveFiles() {
    const names = [];
    getActiveFiles().forEach((activeFile) => {
        names.push(activeFile.querySelector('img').title);
    });
    return names;
}

export function findElement(e, text) {
    try {
        const element = e.path.find(x => x.classList.contains(text));
        return element;
    } catch {
        return null;
    }
}
