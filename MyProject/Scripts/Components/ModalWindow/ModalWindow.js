import imageService from '../../image-service';
import Directories from '../Directories';
import {
    getFolderProperties, getActiveFolderProperty, getUrlOfActiveFolder,
    leftPart, getNamesActiveFiles, getNameActiveFile, getNameActiveFolder
} from '../../dom';

const closeWindow = document.querySelector('.close_modal_window');
const modalCancel = document.querySelector('#cancel-modal');
const modalOk = document.querySelector('#ok-modal');
const modalWindow = document.querySelector('#modalWindow');
const inputModal = document.querySelector('#input-modal');
const title = document.querySelector('.modal-title');
const infoText = document.querySelector('#info-text');
const directoriesListModal = document.querySelector('.directories-list');

const directories = new Directories();
const folderElement = document.querySelector('.directories-list', '.dirlist', '.folder', '.folder-element');

folderElement.addEventListener('click', e => {
    const folderProperty = getFolderProperties(e);
    const topElementOfTree = directoriesListModal;
    directories.openFolderShowFiles(folderProperty, topElementOfTree);
});

modalOk.addEventListener('click', function () {
    const name = inputModal.value;
    const folderProperty = getActiveFolderProperty(leftPart);
    const url = getUrlOfActiveFolder(leftPart);
    if (modalWindow.dataset.id === 'createFolder') {
        imageService.addDirectory(url, name, folderProperty);
    }
    else if (modalWindow.dataset.id === 'renameFolder') {
        imageService.renameDirectory(url, name, folderProperty);
    }
    else if (modalWindow.dataset.id === 'remoteFolder') {
        imageService.remoteDirectory(url, folderProperty);
    }
    else if (modalWindow.dataset.id === 'remoteFiles') {
        const names = getNamesActiveFiles();
        imageService.remoteFiles(names, url);
    }
    else if (modalWindow.dataset.id === 'renameFile') {
        const nameOld = getNameActiveFile();
        imageService.renameFile(nameOld, name, url);
    }
    else if (modalWindow.dataset.id === 'moveFiles') {
        const names = getNamesActiveFiles();
        const urlNew = getUrlOfActiveFolder(directoriesListModal);
        imageService.moveFiles(names, urlNew, url);
    }
    else if (modalWindow.dataset.id === 'copyFiles') {
        const names = getNamesActiveFiles();
        const urlNew = getUrlOfActiveFolder(directoriesListModal);
        imageService.copyFiles(names, urlNew, url);
    }
    closeModal();
});


closeWindow.addEventListener('click', function () {
    closeModal();
});

modalCancel.addEventListener('click', function () {
    closeModal();
});

function openModalRemoteFolder() {
    openModal({
        titleText: 'Remote the folder',
        info: 'Are you sure that want to delete this folder?',
        inputDisplay: 'none',
        inputValue: '',
        idWindow: 'remoteFolder',
        dirList: 'none',
    });
}

function openModalRenameFolder() {
    const topElementOfTree = leftPart;
    const folderName = getNameActiveFolder(topElementOfTree);
    openModal({
        titleText: 'Rename the folder',
        info: 'Enter the new name of this folder:',
        inputDisplay: 'block',
        inputValue: folderName,
        idWindow: 'renameFolder',
        dirList: 'none',
    });
}

function openModalCreateFolder() {
    openModal({
        titleText: 'Create new folder',
        info: 'Enter the name of new folder:',
        inputDisplay: 'block',
        inputValue: '',
        idWindow: 'createFolder',
        dirList: 'none',
    });
}

function openModalRenameFile() {
    const fileName = getNameActiveFile();
    openModal({
        titleText: 'Rename the file',
        info: 'Enter the new name of this file:',
        inputDisplay: 'block',
        inputValue: fileName,
        idWindow: 'renameFile',
        dirList: 'none',
    });
}

function openModalRemoteFiles() {
    openModal({
        titleText: 'Remote the files',
        info: 'Are you sure that want to delete this(these) file(s)?',
        inputDisplay: 'none',
        inputValue: '',
        idWindow: 'remoteFiles',
        dirList: 'none',
    });
}

function openModalMoveFiles() {
    openModal({
        titleText: 'Move files',
        info: 'Choose a folder:',
        inputDisplay: 'none',
        inputValue: '',
        idWindow: 'moveFiles',
        dirList: 'block',
    });
}

function openModalCopyFiles() {
    openModal({
        titleText: 'Copy files',
        info: 'Choose a folder:',
        inputDisplay: 'none',
        inputValue: '',
        idWindow: 'copyFiles',
        dirList: 'block',
    });
}

function openModal(data) {
    title.innerHTML = data.titleText;
    infoText.innerHTML = data.info;
    inputModal.style.display = data.inputDisplay;
    inputModal.value = data.inputValue;
    modalWindow.dataset.id = data.idWindow;
    modalWindow.style.display = 'block';
    directoriesListModal.style.display = data.dirList;
}

function closeModal() {
    modalWindow.style.display = 'none';
}

export default {
    openModalCreateFolder,
    openModalRenameFolder,
    openModalRemoteFolder,
    openModalRenameFile,
    openModalRemoteFiles,
    openModalMoveFiles,
    openModalCopyFiles,
}