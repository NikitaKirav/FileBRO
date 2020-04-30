import file from '../File';
import navigation from '../Navigation';
import imageService from '../../image-service';
import { fileExplorer } from '../../dom';

export default class Files {

    getFiles(url) {
        fileExplorer.innerHTML = '';
        imageService.getFiles(url)
            .then(data => {
                this.renderFiles(data);
                this.drawToDom(fileExplorer);
                navigation.showButtonsChangingFile();
            });
    }

    drawToDom(selector) {
        this.selector = selector;
        selector.appendChild(this.fragment);
    }

    renderFiles(data) {
        this.fragment = document.createDocumentFragment();
        data.forEach(data => {
            const li = document.createElement('li');
            li.classList.add('image-element', 'flex-item');
            li.innerHTML = file(data);
            this.fragment.appendChild(li);
        });
    }
}