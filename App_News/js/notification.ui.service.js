class NotificationUI {
  constructor() {
    this.notificationContainer = document.querySelector('#search-container');
  }

  /**
   * addNotification - add a notification to the UI
   * @param {String} message [description]
   */
  addNotification(message) {
    const template = NotificationUI.generateNotificationTemplate(message);
    this.notificationContainer.insertAdjacentHTML('beforeend', template);
  }

  /**
   * clearContainer - deletes notification if there is any
   * @return {[type]} [description]
   */
  clearContainer() {
    if( document.querySelector('.alert-message') ) {
      document.querySelector('.alert-message').remove();  
    }
  }

  /**
   * generateNotificationTemplate - creates a notification template for adding it to UI
   * @param  {String} message [description]
   * @return {[type]}         [description]
   */
  static generateNotificationTemplate(message) {
    return `
        <div class="card panel teal lighten-4 alert-message">
            <span class="grey-text text-darken-2 alert--text">${message}</span>
        </div>
    `;
  }
}