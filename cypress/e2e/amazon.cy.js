import AmazonPage from './page_objects/amazon';  


describe('amazon', () => {
  const amazon = new AmazonPage();  
  afterEach(() => {
    
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.reload();
  });

  it('Successfuly search, filter, and select produc in amazon', () => {
    cy.viewport(1920, 1080);  

    // Akses halaman Amazon dengan timeout lebih panjang
    cy.visit(Cypress.env("AMAZON_URL"), { timeout: 120000 });
    cy.get("#twotabsearchtextbox", { timeout: 120000 }).should("be.visible");
    amazon.searchForProduct("chair");
    amazon.verifyResult("chair");
    amazon.sortByPriceHighToLow();
    amazon.verifySortByPriceHighToLow();
    amazon.selectProduct();
    amazon.verifySelectedProduct();


  });
});
