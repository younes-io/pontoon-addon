function ToolbarButton(options) {
    this._options = options;
    this._updateError = false;
    this._refreshInterval;
}

ToolbarButton.prototype = {
    init: function() {
        this._addContextMenu();
        this._watchOptionsUpdates();
        this._listenToMessagesFromPopup();
        this.reload();
    },

    _updateNumberOfUnreadNotifications: function() {
        this.updateBadge('');
        fetch('https://pontoon.mozilla.org/notifications/', {
            credentials: 'include',
            redirect: 'manual',
        }).then(function(response) {
            this._updateError = (response.status != 200);
            if (!this._updateError) {
                return response.text();
            } else {
                chrome.storage.local.remove('notificationsDocText');
                this.updateBadge('!');
                this._scheduleOrUpdateRefresh();
                return undefined;
            }
        }.bind(this)).then(function(text) {
            if (text != undefined) {
                chrome.storage.local.set({notificationsDocText: text});
                var notificationsDoc = new DOMParser().parseFromString(text, 'text/html');
                var unreadCount = notificationsDoc.querySelectorAll('#main .notification-item[data-unread=true]').length;
                this.updateBadge(unreadCount);
            }
        }.bind(this));
    },

    _setRefresh: function(intervalMinutes) {
        clearInterval(this._refreshInterval);
        this._refreshInterval = setInterval(this._updateNumberOfUnreadNotifications.bind(this), intervalMinutes * 60 * 1000);
    },

    _scheduleOrUpdateRefresh: function() {
        if (!this._updateError) {
            var optionKey = 'options.notifications_update_interval';
            this._options.get([optionKey], function(item) {
                var intervalMinutes = parseInt(item[optionKey], 10);
                this._setRefresh(intervalMinutes);
            }.bind(this));
        } else {
            var intervalMinutes = 1;
            this._setRefresh(intervalMinutes);
        }
    },

    _watchOptionsUpdates: function() {
        chrome.storage.onChanged.addListener(function(changes, areaName) {
            if (changes['options.notifications_update_interval'] !== undefined) {
                this._scheduleOrUpdateRefresh();
            }
        }.bind(this));
    },

    _listenToMessagesFromPopup: function() {
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.type == 'notifications-reload-request') {
                this.reload();
            }
        }.bind(this));
    },

    _addContextMenu: function() {
        chrome.contextMenus.create({
            title: 'Reload notifications',
            contexts: ['browser_action'],
            onclick: this.reload.bind(this),
        });
    },

    updateBadge: function(text) {
        chrome.browserAction.setBadgeText({text: text.toString()});
        if (text != 0) {
            chrome.browserAction.setBadgeBackgroundColor({color: '#F36'});
        } else {
            chrome.browserAction.setBadgeBackgroundColor({color: '#4d5967'});
        }
    },

    reload: function() {
        this._updateNumberOfUnreadNotifications();
        this._scheduleOrUpdateRefresh();
    },
}