const remote = require('electron').remote;


// alert(remote.app.getVersion());

// document.getElementById("version-dataFile").innerText = 'v' + remote.app.getVersion();
document.getElementById("version-software").innerText = 'v' + remote.app.getVersion();

// When document has loaded, initialise
document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        handleWindowControls();
    }
};

function handleWindowControls() {
    let window = remote.getCurrentWindow();
    const minButton = document.getElementById('min-button'),
        maxButton = document.getElementById('max-button'),
        restoreButton = document.getElementById('restore-button'),
        closeButton = document.getElementById('close-button');

    minButton.addEventListener("click", event => {
        window = remote.getCurrentWindow();
        window.minimize();
    });

    maxButton.addEventListener("click", event => {
        window = remote.getCurrentWindow();
        window.maximize();
    });

    restoreButton.addEventListener("click", event => {
        window = remote.getCurrentWindow();
        window.unmaximize();
    });

    // Toggle maximise/restore buttons when maximisation/unmaximisation
    // occurs by means other than button clicks e.g. double-clicking
    // the title bar:
    toggleMaxRestoreButtons();
    window.on('maximize', toggleMaxRestoreButtons);
    window.on('unmaximize', toggleMaxRestoreButtons);

    closeButton.addEventListener("click", event => {
        window = remote.getCurrentWindow();
        window.close();
    });

    function toggleMaxRestoreButtons() {
        window = remote.getCurrentWindow();
        if (window.isMaximized()) {
            maxButton.style.display = "none";
            restoreButton.style.display = "flex";
        } else {
            restoreButton.style.display = "none";
            maxButton.style.display = "flex";
        }
    }
}
