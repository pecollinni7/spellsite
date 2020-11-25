class NotificationManager
{
    static #_id;

    static get #id() { return this.#_id; }
    static set #id(value) { this.#_id = value; }

    static addNotification(title, message='', autohide = false)
    {
        this.#id = Math.random().toString(36).substring(7);

        $('#notificationOverlay').append(NotificationManager.#generateHtml(title, message, this.#id));

        if (autohide)
        {
            setTimeout(() => {
                $('#' + this.#id).alert('close');
            }, 2000);
        }
    }

    static #generateHtml(title, message, elementId)
    {
        // let dataAutoHide = 'false';

        // if (autohide)
        // {
        // dataAutoHide = 'true';
        // }

        return `
            <div class="alert alert-secondary alert-dismissible fade show" id="${elementId}" role="alert">
                <strong>${title}</strong>${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
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