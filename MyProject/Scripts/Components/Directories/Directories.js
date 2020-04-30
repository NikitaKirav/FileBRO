import directory from '../Directory';
import Files from '../Files';
import imageService from '../../image-service';
import {
    getFolder, getUrlOfFolder, getMaginLeftOfFolder
} from '../../dom';


export default class Directories {

    openFolderShowFiles(folderProperty, topElementOfTree) {
        const folder = getFolder(folderProperty);
        const url = getUrlOfFolder(folderProperty);
        if (!url) {
            return;
        }
        this.removeLastActiveElement(topElementOfTree);
        this.makeActiveElement(folderProperty);

        if (folder.classList.contains('isOpen')) {
            this.closeTheFolder(folder);
        }
        else {
            folder.classList.add('isOpen');
            const marginA = getMaginLeftOfFolder(folderProperty);
            imageService.getDirectories(url)
                .then(data => {
                    this.renderDirectory(data, marginA);
                    this.drawToDom(folder);
                });            
        }
    }

    drawToDom(selector) {
        this.selector = selector;
        selector.appendChild(this.fragment);
    }

    renderDirectory(data, marginA) {
        this.fragment = document.createDocumentFragment();
        const ul = document.createElement('ul');
        ul.className = 'dirlist';
        this.fragment.appendChild(ul);
        data.forEach(data => {
            const li = document.createElement('li');
            li.classList.add('folder', 'task');
            li.innerHTML = directory(data, marginA);
            ul.appendChild(li);
        });
    }

    closeTheFolder(folder) {
        folder.removeChild(folder.lastChild);
        folder.classList.remove('isOpen');
    }

    makeActiveElement(element) {
        if (!element) {
            return;
        }
        element.classList.add('activeFolder');
    }

    removeLastActiveElement(topElementOfTree) {
        const lastActive = topElementOfTree.querySelector('.activeFolder');
        if (!lastActive) {
            return;
        }

        lastActive.classList.remove('activeFolder');
    }
}