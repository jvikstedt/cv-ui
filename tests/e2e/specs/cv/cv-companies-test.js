describe("CV projects", () => {
  let user;

  beforeEach(() => {
    cy.login();
    cy.getUser().then((u) => (user = u));
  });

  afterEach(() => {
    cy.resetWorkExperiences();
  });

  it("Add Test company as a company ", () => {
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.contains("New work experience").click();

    cy.get("input[name=company]").first().type("Test company");

    cy.get(".v-list-item__content").last().click();

    cy.get("input[name=jobTitle]").type("Developer");
    cy.get("input[name=description]").type("foo");

    cy.pickMonthAndYear("startYearMonth", "2000", "Jan");
    cy.pickMonthAndYear("endYearMonth", "2002", "May");

    cy.contains("Save").click();

    cy.get("#cv-work-experiences").contains("Test company");
    cy.get("#cv-work-experiences").contains("Developer");

    cy.reload();
    cy.get("#cv-work-experiences").contains("Test company");
    cy.get("#cv-work-experiences").contains("Developer");
  });

  it("Edit existing work experience", () => {
    cy.createWorkExperience();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-work-experiences .edit-work-experience-btn").first().click();

    cy.get("input[name=jobTitle]").clear().type("Software Engineer");

    cy.contains("Save").click();

    cy.get("#cv-work-experiences").contains("Test company");
    cy.get("#cv-work-experiences").contains("Software Engineer");

    cy.reload();
    cy.get("#cv-work-experiences").contains("Test company");
    cy.get("#cv-work-experiences").contains("Software Engineer");
  });

  it("Delete existing work experience", () => {
    cy.createWorkExperience();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-work-experiences .edit-work-experience-btn").first().click();

    cy.contains("Delete").click();

    cy.contains("Test company").should("not.exist");
    cy.reload();
    cy.contains("Test company").should("not.exist");
  });
});
