// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import jwt from "jwt-decode";
import * as R from "ramda";

Cypress.Commands.add(
  "login",
  (username = Cypress.env("USERNAME"), password = Cypress.env("PASSWORD")) => {
    cy.request({
      method: "POST",
      url: `${Cypress.env("EXTERNAL_API")}/auth/signin`,
      body: {
        username: username,
        password: password
      }
    })
      .its("body")
      .then(body => {
        window.localStorage.setItem("accessToken", body.accessToken);
      });
  }
);

Cypress.Commands.add("logout", () => {
  window.localStorage.removeItem("accessToken");
});

Cypress.Commands.add(
  "createSkill",
  (
    skillSubjectName = "Ruby",
    experienceInYears = 1,
    interestLevel = 1,
    highlight = false
  ) => {
    const accessToken = window.localStorage.getItem("accessToken");
    const tokenData = jwt(accessToken);

    const cvId = tokenData.cvIds[0];

    cy.request({
      method: "GET",
      url: `${Cypress.env("EXTERNAL_API")}/skill_subjects`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .its("body")
      .then(body => {
        const skillSubject = R.find(
          s => R.equals(s.name, skillSubjectName),
          body
        );

        cy.request({
          method: "POST",
          url: `${Cypress.env("EXTERNAL_API")}/cv/${cvId}/skills`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          body: {
            skillSubjectId: skillSubject.id,
            experienceInYears,
            interestLevel,
            highlight
          }
        });
      });
  }
);

Cypress.Commands.add("resetSkills", () => {
  const accessToken = window.localStorage.getItem("accessToken");
  const tokenData = jwt(accessToken);
  const cvId = tokenData.cvIds[0];

  cy.request({
    method: "GET",
    url: `${Cypress.env("EXTERNAL_API")}/cv/${cvId}/skills`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
    .its("body")
    .then(body => {
      for (const skill of body) {
        cy.request({
          method: "DELETE",
          url: `${Cypress.env("EXTERNAL_API")}/cv/${cvId}/skills/${skill.id}`,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
    });
});

Cypress.Commands.add("getUser", () => {
  const accessToken = window.localStorage.getItem("accessToken");
  const user = jwt(accessToken);
  return user;
});

Cypress.Commands.add("resetUserInformation", () => {
  const accessToken = window.localStorage.getItem("accessToken");
  const user = jwt(accessToken);

  cy.request({
    method: "PATCH",
    url: `${Cypress.env("EXTERNAL_API")}/users/${user.userId}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    body: {
      firstName: user.firstName,
      lastName: user.lastName
    }
  });
});

Cypress.Commands.add("resetCVInformation", () => {
  const accessToken = window.localStorage.getItem("accessToken");
  const user = jwt(accessToken);

  cy.request({
    method: "PATCH",
    url: `${Cypress.env("EXTERNAL_API")}/cv/${user.cvIds[0]}`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    body: {
      description: ""
    }
  });
});
