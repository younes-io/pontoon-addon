class RemoteLinks {
    /**
     * Initialize instance and watch for options updates.
     * @param team locale
     * @param options
     */
    constructor(team, options) {
        this._team = team;
        this._options = options;
        this._watchOptionsUpdates();
    }

    /**
     * Get the Transvision URL for the team.
     * @returns {string}
     */
    getTransvisionUrl() {
        return `https://transvision.mozfr.org/?locale=${this._team}`;
    }

    /**
     * Get the mozilla-l10n.github.io/styleguides URL for the team.
     * @returns {string}
     */
    getMozillaStyleGuidesUrl() {
        return `https://mozilla-l10n.github.io/styleguides/${this._team}/`;
    }

    /**
     * Get l10n.mozilla.org dashboard URL for the team.
     * @returns {string}
     */
    getElmoDashboardUrl() {
        return `https://l10n.mozilla.org/teams/${this._team}`;
    }

    /**
     * Get Web Dashboard URL for the team.
     * @returns {string}
     */
    getWebDashboardUrl() {
        return `https://l10n.mozilla-community.org/webdashboard/?locale=${this._team}`;
    }

    /**
     * Get Mozilla Wiki L10n:Teams page URL.
     * @returns {string}
     */
    getMozillaWikiL10nTeamUrl() {
        return `https://wiki.mozilla.org/L10n:Teams:${this._team}`;
    }

    /**
     * Get Cambridge dictionary URL (not team specific).
     * @returns {string}
     */
    getCambridgeDictionaryUrl() {
        return 'https://dictionary.cambridge.org/translate/';
    }

    /**
     * Get amaGama search page URL (not team specific).
     * @returns {string}
     */
    getAmaGamaUrl() {
        return 'https://amagama-live.translatehouse.org/';
    }

    /**
     * Get Microsoft Terminology search URL (not team specific).
     * @returns {string}
     */
    getMicrosoftTerminologySearchUrl() {
        return 'https://www.microsoft.com/Language/en-US/Search.aspx';
    }

    /**
     * Get Bugzilla URL for reporting localization bus.
     * @param selectedText to report bug in
     * @param pageUrl to report bug for
     * @param teamComponent name of the Bugzilla component to report to
     * @returns {string}
     */
    getBugzillaReportUrlForSelectedTextOnPage(selectedText, pageUrl, teamComponent) {
        return `https://bugzilla.mozilla.org/enter_bug.cgi?product=Mozilla Localizations&component=${teamComponent}&status_whiteboard=[pontoon-tools-feedback]&bug_file_loc=${pageUrl}&short_desc=[${this._team}] Translation update proposed for "${selectedText}" on ${pageUrl}&comment=The translation:%0A${selectedText}%0A%0AShould be:%0A`;
    }

    /**
     * Keep the team locale in sync with the options.
     * @private
     */
    _watchOptionsUpdates() {
        this._options.subscribeToOptionChange('locale_team', (change) =>
            this._team = change.newValue
        );
    }
}