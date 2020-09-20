describe("CV user", () => {
  let user;

  beforeEach(() => {
    cy.login();
    cy.getUser().then(u => (user = u));
  });

  afterEach(() => {
    cy.resetUserInformation();
    cy.resetCVInformation();
  });

  it("Nagivates to MY CV -page", () => {
    cy.visit("/");

    cy.contains("My CV").click();
    cy.url().should("include", `/cv/${user.cvIds[0]}`);
  });

  it("Edits user information", () => {
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#edit-user-details-btn").click();

    cy.get(".v-dialog .v-card__title").contains(
      `${user.firstName} ${user.lastName}`
    );

    cy.get("input[name=firstName]")
      .clear()
      .type("John");

    cy.contains("Save").click();

    cy.get("#edit-user-details-btn").click();
    cy.get(".v-dialog .v-card__title").contains(`John ${user.lastName}`);
    cy.contains("Cancel").click();

    cy.reload();
    cy.contains("p", `John ${user.lastName}`);
  });

  it("Edits cv information", () => {
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#edit-cv-details-btn").click();

    cy.get(".v-dialog .v-card__title").contains("Edit CV");

    cy.get("textarea[name=description]")
      .clear()
      .type("new description");

    cy.contains("Save").click();

    cy.contains("p", "new description");
    cy.reload();
    cy.contains("p", "new description");
  });
});
