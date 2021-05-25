class NotificationManager
{
    static #_id;

    static get #id() { return this.#_id; }
    static set #id(value) { this.#_id = value; }

    static addNotification(title, message='', autohide = false, bigText = false)
    {
        this.#id = Math.random().toString(36).substring(7);

        $('#notificationOverlay').append(NotificationManager.#generateHtml(title, message, this.#id, bigText));

        if (autohide)
        {
            const id = this.#id;
            setTimeout((e) => {
                $('#' + id).alert('close');
            }, 3000);
        }

        this.playSound();

    }

    static playSound()
    {
        var obj = document.createElement("audio");
        obj.src = "../sounds/264447__kickhat__open-button-2.wav";
        obj.play().then();
    }

    static #generateHtml(title, message, elementId, bigText = false)
    {
        // let dataAutoHide = 'false';

        // if (autohide)
        // {
        // dataAutoHide = 'true';
        // }

        if (bigText)
        {

            return `
                <div class="alert alert-secondary alert-dismissible fade show" id="${elementId}" role="alert" >
                    <b><h5>${title}</h5></b>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <pre>${message}<pre>
                </div>
            `;
        }
        else
        {
            return `
                <div class="alert alert-secondary alert-dismissible fade show" id="${elementId}" role="alert" >
                    <strong>${title}</strong>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    ${message}
                </div>
            `;
        }
        /*
         return `
         <div class="toast" data-autohide="${dataAutoHide}" data-delay="2000">
         <div class="toast-header">
         <strong class="mr-auto">Copy</strong>
         <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">&times;</button>
         </div>
         <div class="toast-body">
         ${message}
         </div>
         </div>
         `;*/
    }
}

module.exports = NotificationManager;