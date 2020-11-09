describe("CV schools", () => {
  let user;

  beforeEach(() => {
    cy.login();
    cy.getUser().then((u) => (user = u));
  });

  afterEach(() => {
    cy.resetEducations();
  });

  it("Add Test school as a school ", () => {
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.contains("New Education").click();

    cy.get("input[name=school]").first().type("Test school");

    cy.get(".v-list-item__content").last().click();

    cy.get("input[name=degree]").type(
      "Bachelor's degree, Information Technology"
    );
    cy.get("input[name=fieldOfStudy]").type("Computer Software Engineering");

    cy.get("input[name=startYear]").type("2000");
    cy.get("input[name=endYear]").type("2004");

    cy.contains("Save").click();

    cy.get("#cv-educations").contains("Test school");
    cy.get("#cv-educations").contains("Computer Software Engineering");

    cy.reload();
    cy.get("#cv-educations").contains("Test school");
    cy.get("#cv-educations").contains("Computer Software Engineering");
  });

  it("Edit existing education", () => {
    cy.createEducation();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-educations .edit-education-btn").first().click();

    cy.get("input[name=fieldOfStudy]").clear().type("Science");

    cy.contains("Save").click();

    cy.get("#cv-educations").contains("Test school");
    cy.get("#cv-educations").contains("Science");

    cy.reload();
    cy.get("#cv-educations").contains("Test school");
    cy.get("#cv-educations").contains("Science");
  });

  it("Delete existing education", () => {
    cy.createEducation();
    cy.visit(`/cv/${user.cvIds[0]}`);

    cy.get("#cv-educations .edit-education-btn").first().click();

    cy.contains("Delete").click();

    cy.contains("Test school").should("not.exist");
    cy.reload();
    cy.contains("Test school").should("not.exist");
  });
});
