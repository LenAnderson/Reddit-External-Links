// ==UserScript==
// @name         Reddit External Links
// @namespace    https://github.com/LenAnderson/
// @downloadURL  https://github.com/LenAnderson/Reddit-External-Links/raw/master/reddit_external_links.user.js
// @version      1.5
// @match        https://www.reddit.com/*
// @match        https://www.reddit.com
// @grant        none
// ==/UserScript==

function changeLinks() {
    [].forEach.call(document.querySelectorAll('.listing-page #siteTable > .thing'), thing => {
        if (thing.querySelector('.midcol.dislikes, .midcol.likes')) {
            thing.style.setProperty('opacity', '0.5');
        }
        if (thing.classList.contains('link')) {
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
        if (location.hash && location.hash.search(/^#\d+$/) == 0) {
            let date = new Date(location.hash.substring(1)*1);
            let things = [].slice.call(document.querySelectorAll('.commentarea > .sitetable .thing'));
            things.forEach(thing => {
                let submitDate = new Date(thing.querySelector('.tagline > time').getAttribute('datetime'));
                console.log(date, submitDate, submitDate > date);
                if (submitDate > date) {
                    console.log('chaing bg');
                    thing.style.setProperty('background-color', 'rgb(230, 244, 255)', 'important');
                }
            });
        }

        if (location.href.search('/comments/') > -1) {
            location.replace(location.href.substring(0,location.href.length - location.hash.length) + '#' + new Date().getTime());
        }
    }

    var mo = new MutationObserver(function(muts) {
        changeLinks();
    });
    mo.observe(document.body, {childList: true, subtree: true});
}
