// cypress/page_objects/YouTubeTrendingPage.js

class YouTubeTrendingPage {
    // Method untuk mengunjungi halaman YouTube Trending
    visitTrendingPage() {
      cy.visit("https://www.youtube.com/feed/trending");
    }
  
    // Method untuk memilih kategori "Movies"
    selectMoviesCategory() {
      cy.get(".yt-tab-shape-wiz__tab--last-tab").contains("Movies").click();
      cy.wait(2000); // Tunggu kategori dimuat
    }

    waitVideoToDisplay(){
        cy.get("ytd-video-renderer").should("have.length.greaterThan", 0);

    }
    
  
    // Method untuk memilih video trending ke-3 dan mengkliknya
    selectThirdTrendingVideo() {
      cy.get("ytd-video-renderer")
        .eq(2) // Pilih video trending ke-3 (index ke-2)
        .within(() => {
          cy.get("#video-title")
            .invoke("text")
            .then((videoTitle) => {
              const title = videoTitle.trim();
              cy.wrap(title).as("selectedVideoTitle"); // Simpan judul video
            });
          
          // Ambil nama channel
          cy.get('#channel-name a')
            .first()
            .invoke("text")
            .then((channelName) => {
              const channel = channelName.trim();
              cy.wrap(channel).as("selectedChannelVideo"); // Simpan nama channel
            });
        })
        .click();
    }
  
    // Method untuk memverifikasi video title di halaman video
    verifyVideoTitle() {
      cy.get("h1.style-scope.ytd-watch-metadata yt-formatted-string", {
        timeout: 10000,
      }).should("be.visible");
  
      cy.get("h1.style-scope.ytd-watch-metadata yt-formatted-string")
        .invoke("text")
        .then((pageTitle) => {
          cy.get("@selectedVideoTitle").then((selectedVideoTitle) => {
            expect(pageTitle.trim()).to.equal(selectedVideoTitle); // Verifikasi judul
          });
        });
    }
   
  
    // Method untuk memverifikasi channel name di halaman video
    verifyChannelName() {
        cy.wait(1000);  // Tunggu 1 detik, atau lebih jika perlu
        cy.get("ytd-video-owner-renderer #upload-info ytd-channel-name #container a.yt-simple-endpoint")
        
          .invoke("text")
          .then((channelName) => {
            cy.get("@selectedChannelVideo").then((selectedChannelVideo) => {
              // Pastikan nama channel sesuai dengan yang diharapkan
              expect(channelName.trim()).to.equal(selectedChannelVideo);
            });
          });
        
    }
  }
  
  export default new YouTubeTrendingPage();
  