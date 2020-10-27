describe("CV projects", () => {
  let user;

  beforeEach(() => {
    cy.login();
    cy.getUser().then((u) => (user = u));
  });

  afterEach(() => {
    cy.resetProjectMemberships();
    cy.resetSkills();
  });

  it("Add Test project as a project", () => {
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.contains("New project").click();

    cy.get("input[name=project]").first().type("Test project");

    cy.get(".v-list-item__content").last().click();

    cy.get("input[name=description]").type("foo");
    cy.get("input[name=role]").type("Developer");

    cy.pickMonthAndYear("startYearMonth", "2000", "Jan");
    cy.pickMonthAndYear("endYearMonth", "2002", "May");

    cy.get("input[name=skill]").first().type("Ansible");
    cy.get(".v-list-item").last().click();

    cy.contains("Save").click();

    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects").contains("Ansible");
    cy.get(".v-expansion-panel-header").contains("Other").click();
    cy.get(".v-chip__content").contains("Ansible");
    cy.get(".v-chip__content").contains("3");

    cy.reload();
    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects").contains("Ansible");
    cy.get(".v-expansion-panel-header").contains("Other").click();
    cy.get(".v-chip__content").contains("Ansible");
    cy.get(".v-chip__content").contains("3");
  });

  it("Edit existing project", () => {
    cy.createProjectMembership();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-projects .edit-project-membership-btn").first().click();

    cy.get("input[name=skill]").first().type("Python");
    cy.get(".v-list-item").last().click();

    cy.contains("Save").click();

    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get(".v-expansion-panel-header").contains("Other").click();
    cy.get(".v-chip__content").contains("Python");
    cy.get(".v-chip__content").contains("3");
    cy.reload();
    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get(".v-expansion-panel-header").contains("Other").click();
    cy.get(".v-chip__content").contains("Python");
    cy.get(".v-chip__content").contains("3");
  });

  it("Delete existing project", () => {
    cy.createProjectMembership();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-projects .edit-project-membership-btn").first().click();

    cy.contains("Delete").click();

    cy.contains("Test company / Test project").should("not.exist");
    cy.reload();
    cy.contains("Test company / Test project").should("not.exist");
  });

  it("Delete existing project skill", () => {
    cy.createProjectMembership();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-projects").contains("Ansible");

    cy.get("#cv-projects .edit-project-membership-btn").first().click();

    cy.get(".remove-skill-btn").first().click();

    cy.contains("Save").click();

    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects").contains("Ansible").should("not.exist");
    cy.reload();
    cy.get("#cv-projects").contains("Test company / Test project");
    cy.get("#cv-projects").contains("Ansible").should("not.exist");
  });
});
