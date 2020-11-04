describe("Search", () => {
  let user;

  beforeEach(() => {
    cy.login();
    cy.getUser().then((u) => (user = u));
  });

  afterEach(() => {
    cy.resetSkills();
  });

  it("Searches admin -user and verifies it opens correct cv", () => {
    cy.visit("/");

    cy.get("input[name=searchbar]").first().type("bob test");

    cy.get(".v-menu__content .v-list-item__content").contains("Bob Test");

    cy.get("input[name=searchbar]").first().clear().type("john");

    cy.get(".v-menu__content .v-list-item__content")
      .contains("Bob Test")
      .should("not.exist");
  });

  it("Searches admin -user with multiple skills", () => {
    cy.createSkill("Docker", 4);
    cy.createSkill("Ruby", 2);
    cy.createSkill("Typescript", 2);

    cy.visit("/");

    cy.contains("Advanced Search").click();

    cy.get("input[name=skill]").first().type("Docker");

    cy.get(".v-list-item").contains("Docker").click();

    cy.get("input[name=skill]").first().type("Ruby");

    cy.get(".v-list-item").contains("Ruby").click();

    cy.get("input[name=skill]").first().type("Typescript");

    cy.get(".v-list-item").contains("Typescript").click();

    cy.waitUntil(
      () => {
        cy.get("#search-view-search-btn").click();
        return cy.get(".v-dialog").then((dialog) => {
          if (dialog.text().includes("Bob Test")) {
            return true;
          }
          return false;
        });
      },
      { interval: 1000 }
    );

    cy.get(".v-dialog .v-list-item__content").contains("Bob Test").click();

    cy.url().should("include", `/cv/${user.cvIds[0]}`);

    cy.contains("Bob Test");
  });
});
