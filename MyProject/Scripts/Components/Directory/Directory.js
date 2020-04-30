export default function directory(data, marginA) {
    if (marginA === "") {
        marginA = "0";
    }
    const html = `
        <div class='folder-element'>
            <a href='#' title='${data.fullName}' style='margin-left: ${parseInt(marginA) + 20}px'>
                <img src='/images/folderIcon.png' alt='' />
                <label class="folder-name">${data.name}</label>
            </a>
        </div>
    `;

    return html;
}

