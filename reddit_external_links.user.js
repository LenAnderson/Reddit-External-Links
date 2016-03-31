// ==UserScript==
// @name         Reddit External Links
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Reddit-External-Links/raw/master/reddit_external_links.user.js
// @version      1.0
// @match        https://www.reddit.com/*
// @match        https://www.reddit.com
// @grant        none
// ==/UserScript==

if (document.querySelector('p').textContent != '(error code: 503)') {
    Array.prototype.forEach.call(document.querySelectorAll('.listing-page #siteTable > .thing.link > .entry'), function(entry) {
        var link = entry.querySelector('a.title');
        if (link.href.search(/^https?:\/\/www.reddit.com/) == -1) {
            link.href = entry.querySelector('.buttons a.comments').href + '?followExternalLink';
            link.setAttribute('data-href-url', link.href);
            link.setAttribute('data-outbound-url', link.href);
        }
    });

    if (location.search == '?followExternalLink') {
        history.replaceState({}, "", location.href.replace(/\?followExternalLink/, ''));
        document.querySelector('.single-page #siteTable > .thing.link > .entry a.title').click();
    }
}
