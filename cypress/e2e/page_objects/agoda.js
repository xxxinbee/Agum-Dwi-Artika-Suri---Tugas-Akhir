class AgodaPage {
  visit() {
    cy.visit(Cypress.env("AGODA_URL"), {
      timeout: 30000,
    });
  }

  selectFlightTab() {
    cy.get("#tab-flight-tab").click();
  }

  setOrigin(origin) {
    cy.get("#flight-origin-search-input").type(origin);
    cy.get(`[data-text="${origin}"]`).click();
  }

  setDestination(destination) {
    cy.get("#flight-destination-search-input").type(destination);
    cy.get(`[data-text="${destination}"]`).click();
  }

  selectDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const weekday = date.toLocaleString("default", { weekday: "short" });

    cy.get(`[aria-label="${weekday} ${month} ${day} ${year} "]`).click();
  }

  clickSearch() {
    cy.get('[data-test="SearchButtonBox"]').click();
  }

  verifyResult(destinationText) {
    cy.get('[data-testid="title"]').should("exist").contains(destinationText);
  }

  selectAirlines(airlineName) {
    let scrollCount = 0;
    const maxScrolls = 10;
    let selectedFlightPrice = "";

    const scrollAndSearch = () => {
      if (scrollCount < maxScrolls) {
        cy.scrollTo("bottom");
        cy.wait(1000);
        cy.get('[data-testid="flightCard-flight-detail"]').then(($cards) => {
          const match = [...$cards].find((card) =>
            card.innerText.includes(airlineName)
          );
          if (match) {
            cy.wrap(match).scrollIntoView().click();

            // Setelah klik, pastikan detail muncul
            cy.get('[data-testid="flight-details-expand"]', {
              timeout: 10000,
            }).should("be.visible");

            // Ambil harga dari detail flight yang terbuka
            cy.wrap(match).within(() => {
              cy.get('[data-testid="crossout-price"]')
                .invoke("text")
                .then((crossoutText) => {
                  const initialPrice = crossoutText.trim();
                  cy.wrap(initialPrice).as("initialFlightPrice"); // Simpan ke alias
                  cy.log(`Harga awal ${airlineName}: ${initialPrice}`);
                });
            });
          } else {
            scrollCount++;
            scrollAndSearch();
          }
        });
      } else {
        cy.log(`${airlineName} not found after ${maxScrolls} scrolls`);
      }
    };

    scrollAndSearch();
    cy.get('[data-component="flight-card-bookButton"]').click();
  }

  verifyBookingPage(data, expectedDate) {
    cy.scrollTo("top");
    cy.get('[data-component="flight-booking-itineraryHeader"] h5')
      .eq(0)
      .should("have.text", data.departureCity); // Untuk departure city
    cy.get('[data-component="flight-booking-itineraryHeader"] h5')
      .eq(1)
      .should("have.text", data.destinationCity); // Untuk destination city
    cy.get('[data-section="title-bar-additionalText"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.include(expectedDate); // Validasi tanggal
        expect(text).to.include("1 Penumpang"); // Validasi jumlah penumpang
        expect(text).to.include("Economy"); // Validasi kelas kabin
      });

    cy.wait;
    cy.get("@initialFlightPrice")
      .should("exist")
      .then((initialPrice) => {
        cy.get('[data-component="mob-flight-price-adult-desc"]').should(
          "contain",
          initialPrice
        ); // Misal: selector untuk harga booking
        cy.log(`Verifikasi harga awal: ${initialPrice}`);
      });

    cy.get('[data-component="mob-flight-price-total-desc"]')
      .find('[data-component="mob-price-desc-text"]')
      .invoke("text")
      .then((priceText) => {
        const finalPrice = priceText.trim(); // Menghapus spasi di awal/akhir
        cy.wrap(finalPrice).as("finalFlightPrice"); // Menyimpan harga dalam alias
        cy.log(`Harga akhir: ${finalPrice}`); // Menampilkan harga di log
      });
  }

  fillContactInfo(data) {
    cy.scrollTo("top");
    cy.get("[data-testid='contact\\.contactFirstName']").type(data.firstName);
    cy.get("[data-testid='contact\\.contactLastName']").type(data.lastName);
    cy.get("[data-testid='contact\\.contactEmail']").type(data.email);
    cy.get("[data-testid='contact\\.contactCountryOfResidenceId']").click();
    cy.get("[data-testid='floater-container'] > div.aec39-flex span")
      .contains(data.country)
      .click();
    cy.get("[data-testid='contact\\.contactPhoneNumber']").click();
    cy.get(
      "[data-testid='contact\\.contactPhoneNumber'] > div > div:nth-of-type(2) input"
    ).type(data.phoneNumber);
    cy.get(`input[aria-label="${data.gender}"]`).check();
  }

  fillPassengerDetails(data) {
    cy.get(
      "[data-testid='flight\\.forms\\.i0\\.units\\.i0\\.passengerFirstName']"
    ).type(data.firstName);
    cy.get(
      "[data-testid='flight\\.forms\\.i0\\.units\\.i0\\.passengerLastName']"
    ).type(data.lastName);
    cy.get(
      "[data-testid='flight\\.forms\\.i0\\.units\\.i0\\.passengerDateOfBirth-DateInputDataTestId']"
    ).type(data.birthDay);
    cy.get(
      '[data-testid="flight.forms.i0.units.i0.passengerDateOfBirth-MonthInputDataTestId"]'
    ).click();
    cy.get('[data-testid="floater-container"] > div.aec39-flex span')
      .contains(data.birthMonth)
      .click();
    cy.get(
      "[data-testid='flight\\.forms\\.i0\\.units\\.i0\\.passengerDateOfBirth-YearInputDataTestId']"
    ).type(data.birthYear);

    cy.get(
      "[data-testid='flight\\.forms\\.i0\\.units\\.i0\\.passengerNationality'] > div > div > div > div div.aec39-flex-1"
    ).click();
    cy.get("div.aec39-pb-8 input").click();
    cy.get("[data-testid='floater-container'] > div.aec39-flex span")
      .contains(data.country)
      .click();

    cy.get("body").then(($body) => {
      const passportInfoVisible = $body.find("[data-testid='flight\\.forms\\.i0\\.units\\.i0\\.passportNumber']").length > 0;  
    if (passportInfoVisible){
      cy.get(
        "[data-testid='flight\\.forms\\.i0\\.units\\.i0\\.passportNumber']"
      ).type(data.passportNumber);
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passportCountryOfIssue"] button'
      ).click();
      cy.get("[data-testid='floater-container'] > div.aec39-flex span")
        .contains(data.country)
        .click();
  
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passportExpiryDate-DateInputDataTestId"]'
      ).type(data.passportExpiryDate);
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passportExpiryDate-MonthInputDataTestId"]'
      ).click();
      cy.get("[data-testid='floater-container'] > div.aec39-flex span")
        .contains(data.passportExpiryMonth)
        .click();
      cy.get(
        '[data-testid="flight.forms.i0.units.i0.passportExpiryDate-YearInputDataTestId"]'
      ).type(data.passportExpiryYear);

    }

   
  }
)}

  addOn() {
    cy.get('[data-component="flight-continue-to-addOns-button"]')
      .scrollIntoView()
      .contains("Lanjutkan ke add-on")
      .click({ force: true });

    cy.get('[data-component="flight-addons-header-container"]')
      .should("exist")
      .contains("Add-ons");
    cy.get('[data-testid="radio-button-option-no"]').eq(0).click();
  }

  clickPayment() {
    cy.wait(1000); // Tunggu sebentar sebelum klik tombol
    cy.get('[data-testid="continue-to-payment-button"]')
      .should('be.visible')  // Pastikan tombol terlihat di halaman
      .should('not.be.disabled')  // Pastikan tombol tidak dalam keadaan disabled
      .click({ force: true });

    // Cek jika modal muncul
    cy.get("body").then(($body) => {
      const modalVisible =
        $body.find('[data-element-name="unified-modal"]').length > 0; // Pastikan modal ada

      if (modalVisible) {
        // Jika modal muncul, klik tombol "Tidak, terima kasih"
        cy.get('[data-component="last-chance-decline-button"]').click();
        cy.log('Modal muncul dan tombol "Tidak, terima kasih" telah diklik');
      } else {
        // Jika modal tidak muncul, lanjutkan ke proses berikutnya
        cy.log("Modal tidak muncul, lanjutkan ke verifikasi data");
      }

      // Verifikasi data atau langkah berikutnya setelah menangani modal
      cy.wait(1000);  // Gantilah dengan selector untuk verifikasi data
    });
    
  }

  verifyBookingPayment(data, expectedDate) {
    cy.wait(5000);
    cy.get('[data-component="mob-flight-contact-wrapper"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.include(data.firstName);
          
      });

    cy.get('[data-component="flight-booking-itineraryHeader"] h5')
      .eq(0)
      .should("have.text", data.departureCity); // Untuk departure city
    cy.get('[data-component="flight-booking-itineraryHeader"] h5')
      .eq(1)
      .should("have.text", data.destinationCity); // Untuk destination city
    cy.get('[data-section="title-bar-additionalText"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.include(expectedDate); // Validasi tanggal
        expect(text).to.include("1 Penumpang"); // Validasi jumlah penumpang
        expect(text).to.include("Economy"); // Validasi kelas kabin
      });

    cy.wait;
    cy.get("@initialFlightPrice")
      .should("exist")
      .then((initialPrice) => {
        cy.get('[data-component="mob-flight-price-adult-desc"]').should(
          "contain",
          initialPrice
        );
      });

      cy.get("@finalFlightPrice")
      .should("exist")
      .then((finalPrice) => {
        cy.get('[data-component="mob-flight-price-total-desc"]').should(
          "contain",
          finalPrice
        );
      });
    
  }
}
  
  export default AgodaPage;
  