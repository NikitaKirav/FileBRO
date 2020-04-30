import config from './config';
import Directories from './Components/Directories';
import Files from './Components/Files';
import {
    getFolder, leftPart, changeUrlOfFolder, changeNameOfFolder,
    getParentOfFolder, getFolderProperty, getUrlOfFolder,
} from './dom';

function getDirectories(text) {
    if (!text) {
        return;
    }
    return fetch(config.getDirectoryUrl + text)
        .then(r => r.json());
}

function getFiles(text) {
    if (!text) {
        return;
    }
    return fetch(config.getFilesUrl + text)
        .then(r => r.json());
}

function addDirectory(dir, name, folderProperty) {
    if ((!dir) || (!name)) {
        return;
    }
    const directories = new Directories();
    return fetch(config.addDirectory + dir + '&name=' + name)
        .then(r => r.json())
        .then(data => {
            if (data.error !== '') {
                alert(data.error);
                return;
            }
            const folder = getFolder(folderProperty);
            directories.closeTheFolder(folder);
            directories.openFolderShowFiles(folderProperty, leftPart);
        });
}

function renameDirectory(dir, name, folderProperty) {
    if ((!dir) || (!name)) {
        return;
    }
    return fetch(config.renameDirectory + dir + '&name=' + name)
        .then(r => r.json())
        .then(data => {
            if (data.error !== '') {
                alert(data.error);
                return;
            }
            changeUrlOfFolder(folderProperty, data.dir);
            changeNameOfFolder(folderProperty, name);
        });
}

function remoteDirectory(dir, folderProperty) {
    if ((!dir) || (!name)) {
        return;
    }
    const files = new Files();
    const folder = getParentOfFolder(folderProperty);
    const folderPropertyParent = getFolderProperty(folder);
    const directories = new Directories();
    return fetch(config.remoteDirectory + dir)
        .then(r => r.json())
        .then(data => {
            if (data.error !== '') {
                alert(data.error);
                return;
            }            
            directories.closeTheFolder(folder);
            directories.openFolderShowFiles(folderPropertyParent, leftPart);
            files.getFiles(getUrlOfFolder(folderPropertyParent));
        });
}

function uploaFile(upload, dir) {
    if ((!dir) || (!upload)) {
        return;
    }
    const files = new Files();
    var data = new FormData();
    data.append('upload', upload);
    data.append('dir', dir);

    return fetch(config.uploadFile, {
        method: 'POST',
        body: data
    })
        .then(r => r.json())
        .then(data => {
            if (data.error !== '') {
                alert(data.error);
                return;
            }
            files.getFiles(dir);
        });

}

function renameFile(nameOld, nameNew, dir) {
    if ((!nameOld) || (!nameNew) || (!dir)) {
        return;
    }
    const files = new Files();
    return fetch(config.renameFile + dir + '&nameOld=' + nameOld + '&nameNew=' + nameNew)
        .then(r => r.json())
        .then(data => {
            if (data.error !== '') {
                alert(data.error);
                return;
            }
            files.getFiles(dir);
        });
}

function remoteFiles(names, dir) {
    if ((!names) || (!dir))  {
        return;
    }
    const files = new Files();
    return fetch(config.remoteFiles, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ 'names': names, 'dir': dir }),        
    })
        .then(r => r.json())
        .then(data => {
            if (data.error !== '') {
                alert(data.error);
                return;
            }
            files.getFiles(dir);
        });
}

function moveFiles(names, urlNew, url) {
    if ((!names) || (!urlNew) || (!url)) {
        return;
    }
    const files = new Files();
    return fetch(config.moveFiles + urlNew, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ 'names': names, 'dir': url }), 
        })
        .then(r => r.json())
        .then(data => {
            if (data.error !== '') {
                alert(data.error);
                return;
            }
            files.getFiles(url);
        });
}

function copyFiles(names, urlNew, url) {
    if ((!names) || (!urlNew) || (!url)) {
        return;
    }
    const files = new Files();
    return fetch(config.copyFiles + urlNew, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ 'names': names, 'dir': url }),
        })
        .then(r => r.json())
        .then(data => {
            if (data.error !== '') {
                alert(data.error);
                return;
            }
            files.getFiles(url);
        });
}

export default {
    getDirectories,
    getFiles,
    addDirectory,
    renameDirectory,
    remoteDirectory,
    uploaFile,
    renameFile,
    remoteFiles,
    moveFiles,
    copyFiles,
}