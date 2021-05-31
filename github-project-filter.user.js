// ==UserScript==
// @name         GitHub projects - Quick filter by user
// @namespace    michael.friis.userscripts
// @version      1.3
// @description  Allows you to quickly choose a user from the list of assignees and filter issues by them.
// @author       Michael Nissen Thorup Friis
// @match        https://github.com/*/*/projects/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function getUsersFromAssignees() {
        const elementsWithAssignees = document.querySelectorAll("[data-card-assignee]");
        const assignees = []
        for (let i = 0; i < elementsWithAssignees.length; i++) {
            const assignee = JSON.parse(elementsWithAssignees[i].getAttribute("data-card-assignee"));
            for (let x = 0; x < assignee.length; x++) {
                if(assignees.includes(assignee[x])) {
                   continue;
                }
                assignees.push(assignee[x])
            }
        }
        assignees.sort();
        addDropdown(assignees);
    }

    function addDropdown(assignees) {
        const controlpanel = document.getElementsByClassName("project-header-controls")[0];
        const selectList = document.createElement("select");
        selectList.classList.add("form-control");
        selectList.id = "assigneeFiltering";
        controlpanel.insertBefore(selectList, controlpanel.firstChild);

        for (let i = 0; i < assignees.length; i++) {
            const option = document.createElement("option");
            option.value = assignees[i];
            option.text = assignees[i];
            selectList.appendChild(option);
        }

        selectList.addEventListener('change', (event) => {
            const currentProject = location.protocol + '//' + location.host + location.pathname

            //Perhaps this part could be done without loading the entire page again, ideas?
            window.location.replace(currentProject + "?card_filter_query=assignee%3A" + event.target.value);
        });
    }

    //Github loads in each column async. We need to wait until the first column popsup, then wait a little while longer as the rest load. Please help make this better!
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});
    function check(changes, observer) {
        if(document.querySelector('.project-column')) {
            observer.disconnect();
            const delayInMilliseconds = 1000; //1 second
            setTimeout(function() {
                getUsersFromAssignees();
            }, delayInMilliseconds);

        }
    }
})();
