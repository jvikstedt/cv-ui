describe("Export pdf test", () => {
  let user;

  beforeEach(() => {
    cy.login();
    cy.getUser().then((u) => (user = u));
  });

  afterEach(() => {
    cy.deleteTemplate("Test template");
  });

  it("Navigates to export page", () => {
    cy.visit("/");
    cy.contains("My CV").click();
    cy.contains("Export").click();
    cy.location("pathname").should("eq", `/cv/${user.cvIds[0]}/export`);
  });

  it("Creates a pdf template and verifies download link", () => {
    cy.visit(`/cv/${user.cvIds[0]}/export`);
    cy.get("button").contains("Template manager").click();
    cy.get(".v-dialog button").contains("New").click();
    cy.get("input[name=name]").type("Test template");
    cy.get("textarea[name=bodyTemplate]").type(
      `<html>{{}{{} user.firstName }}</html>`
    );
    cy.get(".v-dialog button").contains("Save").click();

    cy.get("#cv-export .v-select .v-select__slot").click();
    cy.get(".v-menu__content").contains("Test template").click();
    cy.get("button").contains("Export").click();
    cy.contains("Download").should("exist");
  });
});
