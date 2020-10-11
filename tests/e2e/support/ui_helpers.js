Cypress.Commands.add("pickMonthAndYear", (inputName, year, month) => {
  cy.get(`input[name=${inputName}]`).click();
  cy.get(".accent--text > button").click();
  cy.get("li").contains(year).click();
  cy.get("td > button").contains(month).click();
  cy.get("button").contains("OK").click();
});
