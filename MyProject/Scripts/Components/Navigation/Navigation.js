import {
    leftPart, rightPart, createFolderButton, copyFileButton,
    renameFolderButton, remoteFolderButton, renameFileButton,
    moveFileButton, remoteFileButton, getImageElements,
    getActiveFiles, chooseFileButton,
} from '../../dom';

function makeActiveLeftPart() {
    leftPart.classList.add('activPart');
    rightPart.classList.remove('activPart');

    createFolderButton.style.display = 'block';
    renameFolderButton.style.display = 'block';
    remoteFolderButton.style.display = 'block';
    renameFileButton.style.display = 'none';
    chooseFileButton.style.display = 'none';
    copyFileButton.style.display = 'none';
    moveFileButton.style.display = 'none';
    remoteFileButton.style.display = 'none';
}

function makeActiveRightPart() {
    rightPart.classList.add('activPart');
    leftPart.classList.remove('activPart');
    showButtonsChangingFile();
    createFolderButton.style.display = 'none';
    renameFolderButton.style.display = 'none';
    remoteFolderButton.style.display = 'none';
}

function makeActiveFile(e) {
    const imageLi = getImageElements(e);
    if (imageLi === null) { return; }

    if (imageLi.classList.contains('activeFile')) {
        imageLi.classList.remove('activeFile');
    } else {
        imageLi.classList.add('activeFile');
    }
    showButtonsChangingFile();
}

function showButtonsChangingFile() {
    const activeFiles = getActiveFiles();
    if (activeFiles.length == 1) {
        chooseFileButton.style.display = 'block';
        renameFileButton.style.display = 'block';
        copyFileButton.style.display = 'block';
        moveFileButton.style.display = 'block';
        remoteFileButton.style.display = 'block';

    } else if (activeFiles.length > 1) {
        chooseFileButton.style.display = 'none';
        renameFileButton.style.display = 'none';
        copyFileButton.style.display = 'block';
        moveFileButton.style.display = 'block';
        remoteFileButton.style.display = 'block';
    }
    else {
        chooseFileButton.style.display = 'none';
        renameFileButton.style.display = 'none';
        copyFileButton.style.display = 'none';
        moveFileButton.style.display = 'none';
        remoteFileButton.style.display = 'none';
    }
}

export default {
    makeActiveLeftPart,
    makeActiveRightPart,
    makeActiveFile,
    showButtonsChangingFile,
}