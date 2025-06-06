class AmazonPage {
    // Method untuk mencari produk
    searchForProduct(product) {
      cy.get("#twotabsearchtextbox").type(product); // Menulis ke kotak pencarian
      cy.get("#nav-search-submit-button").click(); // Klik tombol pencarian
    }
  
    verifyResult(product) {
        cy.location("href").should("include", product);
        cy.get('[data-component-type="s-search-result"]').should('have.length.greaterThan', 0);
    }
    // Method untuk mengurutkan berdasarkan harga termahal
    sortByPriceHighToLow() {
      cy.get('#a-autoid-0-announce').click(); // Klik dropdown untuk memilih pengurutan
      cy.get('a.a-dropdown-link').contains('Price: High to Low').click(); // Pilih 'Price: High to Low'
    }
    
    verifySortByPriceHighToLow() {
     cy.get('a.a-dropdown-link')
        .contains('Price: High to Low')
        .should('have.class', 'a-active');
    
    }

    // Method untuk memilih produk paling kanan di baris pertama
    selectProduct() {
      cy.get('[data-component-type="s-search-result"]')
        .filter(':visible') // Pastikan hanya item yang terlihat
        .then((products) => {
          const numberOfProductsInRow = Math.floor(window.innerWidth / 240); // Misalnya 240px adalah lebar tiap card produk
          const lastProductIndex = numberOfProductsInRow - 1; // Hitung index produk paling kanan

          // Klik produk paling kanan di baris pertama
          cy.wrap(products)
            .eq(lastProductIndex)
            .then((selectedProduct) => {
              // Ambil nama produk
              cy.wrap(selectedProduct)
                .find('.s-title-instructions-style a span')
                .invoke('text')
                .then((titleName) => {
                  const productName = titleName.trim();
                  cy.wrap(productName).as('selectedProductName'); // Simpan nama produk untuk pengecekan nanti
                });
  
              // Ambil harga produk
              cy.wrap(selectedProduct)
                .find('.a-price .a-price-whole')
                .invoke('text')
                .then((price) => {
                  cy.wrap(price.trim()).as('productPrice'); // Simpan harga produk untuk pengecekan nanti
                });
  
              // Klik produk untuk membuka halaman detail
              cy.wrap(selectedProduct)
                .find('.s-title-instructions-style a')
                .click();
            });
        });
    
        
    }

    verifySelectedProduct() {
        cy.get('@selectedProductName').should('exist');  
        cy.get('@productPrice').should('exist');  
  }
}
  
  export default AmazonPage;
  