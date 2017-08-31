function ToolbarButton(options, remotePontoon, remoteLinks) {
    this._options = options;
    this._remotePontoon = remotePontoon;
    this._remoteLinks = remoteLinks;
    this._updateError = false;
    this._refreshInterval;

    this._init();
}

ToolbarButton.prototype = {
    _init: function() {
        this._addOnClickAction();
        this._addContextMenu();
        this._watchStorageChanges();
        this._watchOptionsUpdates();
        this._listenToMessagesFromPopup();
        this._reload();
    },

    _updateNumberOfUnreadNotifications: function() {
        this._updateBadge('');
        this._remotePontoon.updateNotificationsDocText();
    },

    _setRefresh: function(intervalMinutes) {
        clearInterval(this._refreshInterval);
        this._refreshInterval = setInterval(this._updateNumberOfUnreadNotifications.bind(this), intervalMinutes * 60 * 1000);
    },

    _scheduleOrUpdateRefreshWithInterval: function(intervalMinutes) {
        if (!this._updateError) {
            this._setRefresh(intervalMinutes);
        } else {
            this._setRefresh(1);
        }
    },

    _scheduleOrUpdateRefresh: function() {
        var optionKey = 'options.notifications_update_interval';
        this._options.get([optionKey], function(item) {
            var intervalMinutes = parseInt(item[optionKey], 10);
            this._scheduleOrUpdateRefreshWithInterval(intervalMinutes);
        }.bind(this));
    },

    _watchStorageChanges: function() {
        chrome.storage.onChanged.addListener(function(changes, areaName) {
            var docKey = 'notificationsDocText';
            if (changes[docKey] !== undefined) {
                var docContent = changes[docKey].newValue;
                if (docContent != undefined) {
                    var notificationsDoc = new DOMParser().parseFromString(docContent, 'text/html');
                    var unreadCount = notificationsDoc.querySelectorAll('header .notification-item[data-unread=true]').length;
                    this._updateBadge(unreadCount);
                } else {
                    this._updateBadge('!');
                    this._scheduleOrUpdateRefresh();
                }
            }
        }.bind(this));
    },

    _watchOptionsUpdates: function() {
        chrome.storage.onChanged.addListener(function(changes, areaName) {
            var updateIntervalOptionKey = 'options.notifications_update_interval';
            if (changes[updateIntervalOptionKey] !== undefined) {
                var intervalMinutes = parseInt(changes[updateIntervalOptionKey].newValue, 10);
                this._scheduleOrUpdateRefreshWithInterval(intervalMinutes);
            }
            var openPontoonOptionKey = 'options.open_pontoon_on_button_click';
            if (changes[openPontoonOptionKey]) {
                this._setPopup(!changes[openPontoonOptionKey].newValue);
            }
        }.bind(this));
    },

    _listenToMessagesFromPopup: function() {
        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if (request.type == 'notifications-reload-request') {
                this._reload();
            }
        }.bind(this));
    },

    _setPopup: function(showPopup) {
        if (showPopup) {
            chrome.browserAction.setPopup({popup: chrome.extension.getURL('html/notifications-popup.html')});
        } else {
            chrome.browserAction.setPopup({popup: ''});
        }
    },

    _addOnClickAction: function() {
        chrome.browserAction.onClicked.addListener(function(tab) {
            chrome.tabs.create({url: this._remotePontoon.getTeamPageUrl()});
        }.bind(this));
        var optionKey = 'options.open_pontoon_on_button_click';
        this._options.get([optionKey], function(item) {
            this._setPopup(!item[optionKey]);
        }.bind(this));
    },

    _addContextMenu: function() {
        chrome.contextMenus.create({
            title: 'Reload notifications',
            contexts: ['browser_action'],
            onclick: this._reload.bind(this),
        });
        var pontoonPagesMenuId = chrome.contextMenus.create({
            title: 'Pontoon pages',
            contexts: ['browser_action'],
        });
        chrome.contextMenus.create({
            title: 'Home',
            contexts: ['browser_action'],
            parentId: pontoonPagesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remotePontoon.getBaseUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            title: 'Team page',
            contexts: ['browser_action'],
            parentId: pontoonPagesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remotePontoon.getTeamPageUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            title: 'Team bugs',
            contexts: ['browser_action'],
            parentId: pontoonPagesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remotePontoon.getTeamBugsUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            title: 'Machinery',
            contexts: ['browser_action'],
            parentId: pontoonPagesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remotePontoon.getMachineryUrl()});}.bind(this),
        });
        var localizationResourcesMenuId = chrome.contextMenus.create({
            title: 'Other l10n sources',
            contexts: ['browser_action'],
        });
        chrome.contextMenus.create({
            title: 'Transvision',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remoteLinks.getTransvisionUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            title: 'amaGama.locamotion.org',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remoteLinks.getAmaGamaUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            title: 'Microsoft Terminology Search',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remoteLinks.getMicrosoftTerminologySearchUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            type: 'separator',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
        });
        chrome.contextMenus.create({
            title: 'Cambridge Dictionary',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remoteLinks.getCambridgeDictionaryUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            type: 'separator',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
        });
        chrome.contextMenus.create({
            title: 'Mozilla Style Guides',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remoteLinks.getMozillaStyleGuidesUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            type: 'separator',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
        });
        chrome.contextMenus.create({
            title: 'Mozilla l10n Team dashboard',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remoteLinks.getElmoDashboardUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            title: 'Mozilla Web l10n Dashboard',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remoteLinks.getWebDashboardUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            title: 'MozillaWiki L10n Team',
            contexts: ['browser_action'],
            parentId: localizationResourcesMenuId,
            onclick: function() {chrome.tabs.create({url: this._remoteLinks.getMozillaWikiL10nTeamUrl()});}.bind(this),
        });
        chrome.contextMenus.create({
            title: 'Pontoon Tools options',
            contexts: ['browser_action'],
            onclick: function() {chrome.runtime.openOptionsPage();}.bind(this),
        });
    },

    _updateBadge: function(text) {
        chrome.browserAction.setBadgeText({text: text.toString()});
        if (text != 0) {
            chrome.browserAction.setBadgeBackgroundColor({color: '#F36'});
        } else {
            chrome.browserAction.setBadgeBackgroundColor({color: '#4d5967'});
        }
    },

    _reload: function() {
        this._updateNumberOfUnreadNotifications();
        this._scheduleOrUpdateRefresh();
    },
}
