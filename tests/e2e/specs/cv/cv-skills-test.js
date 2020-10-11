describe("CV skills", () => {
  let user;

  beforeEach(() => {
    cy.login();
    cy.getUser().then((u) => (user = u));
  });

  afterEach(() => {
    cy.resetSkills();
  });

  it("Add Ansible as a skill", () => {
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.contains("New Skill").click();

    cy.get("input[name=skillSubject]").first().type("Ansible");

    cy.get(".v-list-item__content").last().click();

    cy.get("input[name=experienceInYears]").clear().type("4");

    cy.contains("Save").click();

    cy.get(".v-chip__content").contains("Ansible");
    cy.get(".v-chip__content").contains("4");
    cy.reload();

    cy.get(".v-expansion-panel-header").contains("Other").click();
    cy.get(".v-chip__content").contains("Ansible");
    cy.get(".v-chip__content").contains("4");
  });

  it("Edit existing skill", () => {
    cy.createSkill("Java", 0);
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get(".v-expansion-panel-header").contains("Programming").click();
    cy.get(".v-chip__content").contains("Java").click();

    cy.get("input[name=experienceInYears]").clear().type("3");

    cy.contains("Save").click();

    cy.get(".v-expansion-panel-header").contains("Programming").click();
    cy.get(".v-chip__content").contains("Java");
    cy.get(".v-chip__content").contains("3");
    cy.reload();
    cy.get(".v-expansion-panel-header").contains("Programming").click();
    cy.get(".v-chip__content").contains("Java");
    cy.get(".v-chip__content").contains("3");
  });

  it("Delete existing skill", () => {
    cy.createSkill("Docker", 4);
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get(".v-expansion-panel-header").contains("Other").click();
    cy.contains("Docker").click();

    cy.contains("Delete").click();

    cy.contains("Other").should("not.exist");
    cy.reload();
    cy.contains("Other").should("not.exist");
  });
});
