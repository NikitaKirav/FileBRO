export default function file(data) {
    const html = `
        <img src='${data.fullName}' alt='thumb' title='${data.name}' />
        <div class='filename'>
            ${sliceOfFileName(data.name, data.extension)}
        </div>
        <div class='datechange'>
            ${data.lastWriteTime}
        </div>
        <div class="length">
            ${formatSizeUnits(data.length)}
        </div>
    `;
    return html;
}

function sliceOfFileName(name, extension) {
    return name.slice(0, 18) + '..' + extension;
}

function formatSizeUnits(bytes) {
    if (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + ' GB'; }
    else if (bytes >= 1048576) { bytes = (bytes / 1048576).toFixed(2) + ' MB'; }
    else if (bytes >= 1024) { bytes = (bytes / 1024).toFixed(2) + ' KB'; }
    else if (bytes > 1) { bytes = bytes + ' bytes'; }
    else if (bytes == 1) { bytes = bytes + ' byte'; }
    else { bytes = '0 byte'; }
    return bytes;
}