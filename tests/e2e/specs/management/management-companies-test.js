describe("Management companies", () => {
  beforeEach(() => {
    cy.login(Cypress.env("ADMIN_USERNAME"), Cypress.env("ADMIN_PASSWORD"));
    cy.viewport(1280, 1024);
  });

  afterEach(() => {
    cy.deleteCompany("e2e test company");
    cy.deleteCompany("new company name");
  });

  it("Navigates to companies management view", () => {
    cy.visit("/");
    cy.get(".v-list-item__title").contains("Companies").click();
    cy.location("pathname").should("eq", `/companies`);
  });

  it("Search company", () => {
    cy.createCompany();
    cy.visit("/companies");
    cy.get(".v-card").contains("Search").parent().type("e2e test company");
    cy.get(".v-data-table tbody td").contains("e2e test company");
  });

  it("Create a new company", () => {
    cy.get("button").contains("New").click();
    cy.get("input[name=name]").clear().type("new company name");
    cy.get("button").contains("Save").click();
    cy.get(".v-data-table tbody td").contains("new company name");
  });

  it("Edit company", () => {
    cy.createCompany();
    cy.visit("/companies");
    cy.get(".v-card").contains("Search").parent().type("e2e test company");
    cy.get(".v-data-table tbody td").contains("e2e test company");
    cy.get("button.mdi-pencil").click();

    cy.get("input[name=name]").clear().type("new company name");
    cy.get("button").contains("Save").click();
    cy.get(".v-data-table tbody td").contains("new company name");
    cy.get(".v-data-table tbody td")
      .contains("e2e test company")
      .should("not.exist");
  });
});
