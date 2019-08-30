// ==UserScript==
// @name         Reddit - External Links
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Reddit-External-Links/raw/master/reddit_external_links.user.js
// @version      1.10
// @match        https://www.reddit.com/*
// @match        https://www.reddit.com
// @grant        none
// ==/UserScript==

function changeLinks() {
    [].forEach.call(document.querySelectorAll('.listing-page #siteTable > .thing'), thing => {
        if (thing.querySelector('.midcol.dislikes, .midcol.likes')) {
            thing.style.setProperty('opacity', '0.5');
        }
        if (thing.classList.contains('link') && thing.querySelector('.buttons a.comments')) {
            let link = thing.querySelector('.entry a.title');
            if (link.href.search(/^https?:\/\/www.reddit.com/) == -1) {
                link.href = thing.querySelector('.buttons a.comments').href + '?followExternalLink';
                link.setAttribute('data-href-url', link.href);
                link.setAttribute('data-outbound-url', link.href);
            }
        }
    });
}

if (!document.querySelector('p') || document.querySelector('p').textContent != '(error code: 503)') {
    changeLinks();

    if (location.search == '?followExternalLink') {
        history.replaceState({}, "", location.href.replace(/\?followExternalLink/, '').substring(0,location.href.length - location.hash.length) + '#' + new Date().getTime());
        document.querySelector('.single-page #siteTable > .thing.link > .entry a.title').click();
    } else {
        let times;
        try {
            times = JSON.parse(localStorage.getItem('reddit-external-links-times')) || {};
        } catch (ex) {
            times = {};
        }
        let date;
        if (location.hash && location.hash.search(/^#\d+$/) == 0) {
            date = new Date(location.hash.substring(1)*1);
        } else if (times[location.pathname]) {
            date = new Date(times[location.pathname]);
        }
        if (date) {
            let things = [].slice.call(document.querySelectorAll('.commentarea > .sitetable .thing[data-type="comment"]'));
            things.forEach(thing => {
                let submitDate = new Date(thing.querySelector('.tagline > time').getAttribute('datetime'));
                if (submitDate > date) {
                    thing.style.setProperty('background-color', 'rgb(230, 244, 255)', 'important');
                }
            });
        }

        if (location.href.search('/comments/') > -1) {
            location.replace(location.href.substring(0,location.href.length - location.hash.length) + '#' + new Date().getTime());
            times[location.pathname] = new Date().getTime();
            let newTimes = {};
            let cutoff = new Date().getTime() - 1000 * 60 * 60 * 24 * 2;
            Object.keys(times).forEach(p => {
                if (times[p] > cutoff) newTimes[p] = times[p];
            });
            localStorage.setItem('reddit-external-links-times', JSON.stringify(newTimes));
        }
    }

    var mo = new MutationObserver(function(muts) {
        changeLinks();
    });
    mo.observe(document.body, {childList: true, subtree: true});
    let side = document.querySelector('.side');
    if (side) {
        side.style.position = 'relative';
        side.style.zIndex = '999';
    }
}
