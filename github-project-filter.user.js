// ==UserScript==
// @name         GitHub projects - Quick filter by user
// @namespace    https://www.lego.com
// @version      0.2
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
        for (let i = 0; i < elementsWithAssignees.length; i++) {
            let assignee = JSON.parse(elementsWithAssignees[i].getAttribute("data-card-assignee"));
            for (let x = 0; x < assignee.length; x++) {
                if(assignees.includes(assignee[x])) {
                   continue;
                }
                assignees.push(assignee[x])
            }
        }
        addDropdown(assignees);
    }

    function addDropdown(assignees) {
        let controlpanel = document.getElementsByClassName("project-header-controls")[0];
        let selectList = document.createElement("select");
        selectList.id = "assigneeFiltering";
        controlpanel.appendChild(selectList);

        //Create and append the options
        for (let i = 0; i < assignees.length; i++) {
            let option = document.createElement("option");
            option.value = assignees[i];
            option.text = assignees[i];
            selectList.appendChild(option);
        }

        selectList.addEventListener('change', (event) => {
            let currentProject = location.protocol + '//' + location.host + location.pathname
            window.location.replace(currentProject + "?card_filter_query=assignee%3A" + event.target.value);
        });
    }

    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});
    function check(changes, observer) {
        if(document.querySelector('.project-column')) {
            observer.disconnect();
            let delayInMilliseconds = 1000; //1 second
            setTimeout(function() {
                getUsersFromAssignees();
            }, delayInMilliseconds);

        }
    }

})();