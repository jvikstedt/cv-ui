describe("CV projects", () => {
  let user;

  beforeEach(() => {
    cy.login();
    cy.getUser().then(u => (user = u));
  });

  afterEach(() => {
    cy.resetProjectMemberships();
    cy.resetSkills();
  });

  it("Add Test project as a project", () => {
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.contains("New project").click();

    cy.get("input[name=project]")
      .first()
      .type("Test project");

    cy.get(".v-list-item__content")
      .last()
      .click();

    cy.get("input[name=description]").type("foo");

    cy.get("input[name=startYear]").type("2000");

    cy.get("input[name=startMonth]").type("1");

    cy.get("input[name=skillSubjects]")
      .first()
      .type("Ansible", { force: true });

    cy.get(".v-list-item__content")
      .last()
      .click();

    cy.get("input[name=skillSubjects]")
      .first()
      .type("{esc}", { force: true });

    cy.contains("Save").click();

    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects").contains("Ansible");
    cy.reload();
    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects").contains("Ansible");
  });

  it("Edit existing project", () => {
    cy.createProjectMembership();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-projects .edit-project-membership-btn")
      .first()
      .click();

    cy.get("input[name=skillSubjects]")
      .first()
      .type("Python", { force: true });

    cy.get(".v-list-item__content")
      .last()
      .click();

    cy.get("input[name=skillSubjects]")
      .first()
      .type("{esc}", { force: true });

    cy.contains("Save").click();

    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects").contains("Ansible");
    cy.get("#cv-projects").contains("Python");
    cy.reload();
    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects").contains("Ansible");
    cy.get("#cv-projects").contains("Python");
  });

  it("Delete existing project", () => {
    cy.createProjectMembership();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-projects .edit-project-membership-btn")
      .first()
      .click();

    cy.contains("Delete").click();

    cy.contains("Test company / Test project").should("not.exist");
    cy.reload();
    cy.contains("Test company / Test project").should("not.exist");
  });

  it("Delete existing project skill", () => {
    cy.createProjectMembership();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-projects").contains("Ansible");

    cy.get("#cv-projects .edit-project-membership-btn")
      .first()
      .click();

    cy.contains("Ansible")
      .get(".v-chip__close")
      .click();

    cy.contains("Save").click();

    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects")
      .contains("Ansible")
      .should("not.exist");
    cy.reload();
    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects")
      .contains("Ansible")
      .should("not.exist");
  });
});
