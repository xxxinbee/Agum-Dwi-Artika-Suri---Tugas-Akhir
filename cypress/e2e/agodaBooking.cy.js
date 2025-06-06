import bookingData from '../fixtures/bookingData.json';
import AgodaPage from './page_objects/agoda';

describe("Agoda Booking", () => {
  const agoda = new AgodaPage();

  beforeEach(() => {
    Cypress.on("uncaught:exception", () => false);
  });

  it("successfully booking flight", () => {
    agoda.visit();
    agoda.selectFlightTab();
    agoda.setOrigin(bookingData.passenger.departureCity);
    agoda.setDestination(bookingData.passenger.destinationCity);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expectedDate = `${tomorrow.getDate()} ${tomorrow.toLocaleString('default', { month: 'short' })}`;
    agoda.selectDate(tomorrow);
    agoda.clickSearch();
    agoda.verifyResult("Keberangkatan ke Singapura");
    agoda.selectAirlines(bookingData.passenger.airline);
    agoda.fillContactInfo(bookingData.passenger);
    agoda.fillPassengerDetails(bookingData.passenger);
    agoda.verifyBookingPage(bookingData.passenger, expectedDate);
    agoda.addOn();
    agoda.clickPayment();
    agoda.verifyBookingPayment(bookingData.passenger, expectedDate);
  });
});
