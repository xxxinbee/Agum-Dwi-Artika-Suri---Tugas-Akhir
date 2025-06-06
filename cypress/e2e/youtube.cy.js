// cypress/integration/youtube_trending_spec.js
import youtube from "./page_objects/youtube";

describe('YouTube Trending', () => {
 
  beforeEach(() => {
    Cypress.on("uncaught:exception", () => false);
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.reload();
  });

  it("should navigate to trending page, select Movies category and verify video title and channel", () => {
    cy.viewport(1920, 1080); // Set viewport ke 1920x1080
    youtube.visitTrendingPage();
    youtube.selectMoviesCategory();
    youtube.waitVideoToDisplay();
    youtube.selectThirdTrendingVideo();
    youtube.verifyVideoTitle();
    youtube.verifyChannelName();
  });
});
