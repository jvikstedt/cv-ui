describe("Login", () => {
  const username = Cypress.env("USERNAME");
  const password = Cypress.env("PASSWORD");

  beforeEach(() => {
    cy.logout();
  });

  it("Navigates to /login -page when not logged in", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/login");
  });

  it("Succesfully logins when credentials are correct", () => {
    cy.visit("/login");

    cy.get("input[name=username]").type(username);

    cy.get("input[name=password]").type(password);

    cy.contains("Login").click();

    cy.location("pathname").should("eq", "/");
    cy.contains("My CV");
  });

  it("Fails to login with wrong password", () => {
    cy.visit("/login");

    cy.get("input[name=username]").type(username);

    cy.get("input[name=password]").type("WrongPassword123");

    cy.contains("Login").click();

    cy.location("pathname").should("eq", "/login");

    cy.contains("Error: Request failed with status code 401");
  });

  it("Shows validation errors if fields are empty", () => {
    cy.visit("/login");
    cy.contains("Login").click();
    cy.location("pathname").should("eq", "/login");

    cy.contains("is required");
    cy.contains("is required");
  });

  it("Succesfully logouts when logout button is pressed", () => {
    cy.login();

    cy.visit("/");

    cy.get("#logout-btn").click();

    cy.location("pathname").should("eq", "/login");

    cy.window().then((window) =>
      expect(window.localStorage.getItem("accessToken")).to.eq(null)
    );
  });
});
