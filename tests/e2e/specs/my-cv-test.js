describe("MY CV", () => {
  let user;

  beforeEach(() => {
    cy.login();
    cy.getUser().then(u => (user = u));
  });

  afterEach(() => {
    cy.resetSkills();
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

  it("Add Ansible as a skill", () => {
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.contains("New Skill").click();

    cy.get("input[name=skillSubject]")
      .first()
      .type("Ansible");

    cy.get(".v-list-item__content")
      .last()
      .click();

    cy.get("input[name=experienceInYears]")
      .clear()
      .type("4");

    cy.contains("Save").click();

    cy.get(".v-chip__content").contains("Ansible");
    cy.get(".v-chip__content").contains("4");
    cy.reload();
    cy.get(".v-chip__content").contains("Ansible");
    cy.get(".v-chip__content").contains("4");
  });

  it("Edit existing skill", () => {
    cy.createSkill("Java", 1);
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get(".v-chip__content")
      .contains("Java")
      .click();

    cy.get("input[name=experienceInYears]")
      .clear()
      .type("3");

    cy.contains("Save").click();

    cy.get(".v-chip__content").contains("Java");
    cy.get(".v-chip__content").contains("3");
    cy.reload();
    cy.get(".v-chip__content").contains("Java");
    cy.get(".v-chip__content").contains("3");
  });

  it("Delete existing skill", () => {
    cy.createSkill("Docker", 4);
    cy.visit(`/cv/${user.cvIds[0]}`);
    cy.contains("Docker").click();

    cy.contains("Delete").click();

    cy.contains("Docker").should("not.exist");
    cy.reload();
    cy.contains("Docker").should("not.exist");
  });
});
