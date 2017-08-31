function RemoteLinks(team) {
    this._team = team;
    this._watchOptionsUpdates();
}

RemoteLinks.prototype = {
    getTransvisionUrl: function() {
        return `https://transvision.mozfr.org/?locale=${this._team}`;
    },

    getMozillaStyleGuidesUrl: function() {
        return `https://mozilla-l10n.github.io/styleguides/${this._team}/`;
    },

    getElmoDashboardUrl: function() {
        return `https://l10n.mozilla.org/teams/${this._team}`;
    },

    getWebDashboardUrl: function() {
        return `https://l10n.mozilla-community.org/webdashboard/?locale=${this._team}`;
    },

    getMozillaWikiL10nTeamUrl: function() {
        return `https://wiki.mozilla.org/L10n:Teams:${this._team}`;
    },

    getCambridgeDictionaryUrl: function() {
        return 'https://dictionary.cambridge.org/translate/';
    },

    getAmaGamaUrl: function() {
        return 'https://amagama-live.translatehouse.org/';
    },

    getMicrosoftTerminologySearchUrl: function() {
        return 'https://www.microsoft.com/Language/en-US/Search.aspx';
    },

    _watchOptionsUpdates: function() {
        chrome.storage.onChanged.addListener(function(changes, areaName) {
            if (changes['options.locale_team'] !== undefined) {
                this._team = changes['options.locale_team'].newValue;
            }
        }.bind(this));
    },
}
