// ==UserScript==
// @name         GitHub projects - Quick filter by user
// @namespace    https://www.lego.com
// @version      0.1
// @description  Allows you to quickly choose a user from the list of assignees and filter issues by them.
// @author       Michael Nissen Thorup Friis
// @match        https://github.com/*/*/projects/*
// @grant        none
// @run-at      document-idle
// ==/UserScript==

(function() {
    'use strict';

    let users = [];

    function getUsersFromAssignees() {
        let elementsWithAssignees = document.querySelectorAll("[data-card-assignee]");
        let assignees = []
        let i;
        for (i = 0; i < elementsWithAssignees.length; i++) {
            let assignee = JSON.parse(elementsWithAssignees[i].getAttribute("data-card-assignee"));
            let x;
            for (x = 0; x < assignee.length; x++) {
                if(assignees.includes(assignee[x])) {
                   continue;
                }
                assignees.push(assignee[x])
            }
        }
        console.log(assignees, "");
    }

    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});
    function check(changes, observer) {
        if(document.querySelector('.project-column')) {
            observer.disconnect();
            var delayInMilliseconds = 1000; //1 second
            setTimeout(function() {
                getUsersFromAssignees();
            }, delayInMilliseconds);

        }
    }

})();