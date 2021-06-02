// ==UserScript==
// @name         GitHub projects - Quick board filters
// @namespace    michael.friis.userscripts
// @version      1.6
// @description  Select boxes that allow filtering on milestones and assignees easily based on what is on the board
// @author       Michael Nissen Thorup Friis
// @match        https://github.com/*/*/projects/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function setSearchQuery(query) {
        document.querySelector('.subnav-search input').value = query;
        document.querySelector('.subnav-search input').dispatchEvent(new KeyboardEvent('input')); // triggering the "input" event which causes the page to load new data, with the new value
    }

    function setupMilestoneFilter() {
        function addDropdown(milestones) {
            const controlpanel = document.getElementsByClassName("project-header-controls")[0];
            const selectList = document.createElement("select");
            selectList.classList.add("form-control");
            selectList.id = "assigneeFiltering";
            controlpanel.insertBefore(selectList, controlpanel.firstChild);

            for (let i = 0; i < milestones.length; i++) {
                const option = document.createElement("option");
                option.value = milestones[i];
                option.text = milestones[i];
                selectList.appendChild(option);
            }

            selectList.addEventListener('change', (event) => {
                setSearchQuery(`milestone:${event.target.value}`);
            });
        }

        const elementsWithMilestones = document.querySelectorAll("[data-card-milestone]");
        const milestones = []
        for (let i = 0; i < elementsWithMilestones.length; i++) {
            const milestone = JSON.parse(elementsWithMilestones[i].getAttribute("data-card-milestone"));
            for (let x = 0; x < milestone.length; x++) {
                if(milestones.includes(milestone[x])) {
                   continue;
                }
                milestones.push(milestone[x])
            }
        }
        milestones.sort();
        addDropdown(milestones);
    }

    function setupAssigneeFilter() {
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
                setSearchQuery(`assignee:${event.target.value}`);
            });
        }

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



    //Github loads in each column async. We need to wait until the first column popsup, then wait a little while longer as the rest load. Please help make this better!
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});
    function check(changes, observer) {
        if(document.querySelector('.project-column')) {
            observer.disconnect();
            const delayInMilliseconds = 1000; //1 second
            setTimeout(function() {
                setupAssigneeFilter();
                setupMilestoneFilter();
            }, delayInMilliseconds);

        }
    }
})();
