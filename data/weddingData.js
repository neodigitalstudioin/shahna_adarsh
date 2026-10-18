/**
 * Master Wedding Data Architecture - Islamic Royal Theme
 * Dynamic, fully customizable data model for luxury digital wedding invitations.
 */

window.weddingDataDefault = {
  studio: {
    name: "Shahna & Adarsh",
    tagline: "Wedding Reception Invitation",
    year: "2026"
  },

  sacred: {
    ganapathiEmblem: "assets/Star Emblem.png",
    themeBackdrop: "assets/Theme.jpg",
    mantra: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    blessing: "In the name of Allah, the Most Gracious, the Most Merciful."
  },

  invitation: {
    eyebrow: "YOU ARE CORDIALLY INVITED TO THE",
    coupleDisplay: "Shahna & Adarsh",
    groomName: "ADARSH",
    brideName: "SHAHNA",
    date: "Thursday, November 12, 2026",
    hijriDate: "1448 Rabi' al-Akhir 2",
    time: "4:00 PM to 8:30 PM",
    receptionDate: "Thursday, November 12, 2026",
    receptionTime: "4:00 PM – 8:30 PM",
    eventDateTimeISO: "2026-11-12T16:00:00+05:30",
    message: "Together with our families, we joyfully invite you to celebrate our union.",
    verse: "Cordially invite your esteemed presence with family on the occasion of the wedding reception of our daughter",
    subheading: "Shahna with Adarsh",
    musicUrl: "assets/wedding_song.mp3",
    hosts: {
      inviters: "Hussain and Shaharban",
      address: "Thiruvananthapuram, Kerala",
      phones: ["+91 9895728351"]
    },
    bestWishes: "With all our little love, Riyan & Minnu"
  },

  couple: {
    couplePhoto: "assets/couple.jpg",
    groom: {
      name: "Adarsh",
      fullName: "Adarsh",
      relationTitle: "GROOM",
      parents: "",
      photo: "assets/couple.jpg",
      familyCity: "Thiruvananthapuram, Kerala"
    },
    bride: {
      name: "Shahna",
      nickname: "",
      fullName: "Shahna",
      relationTitle: "DAUGHTER OF",
      parents: "Hussain and Shaharban",
      photo: "assets/couple.jpg",
      familyCity: "Thiruvananthapuram, Kerala",
      phones: "Phone: +91 9895728351"
    }
  },

  // 4. CELEBRATION SCHEDULE / WEDDING EVENTS
  eventsSection: {
    eyebrow: "WEDDING EVENTS",
    title: "CELEBRATION SCHEDULE",
    subtitle: "“Every moment, every blessing — beautifully planned for family and friends.”",
    events: [
      {
        id: "evt-1",
        category: "WEDDING RECEPTION",
        icon: "celebration",
        title: "Wedding Reception",
        description: "An evening of warm blessings, heartfelt congratulations, and dinner celebration with family and friends celebrating the union of Shahna & Adarsh.",
        date: "Thursday, November 12, 2026",
        time: "From 4:00 PM to 8:30 PM (1448 Rabi' al-Akhir 2)",
        venue: "Sree Balakrishna Kalyana Mandapam, near Thirumala Junction, Thiruvananthapuram, Kerala",
        mapsUrl: "https://maps.google.com/?q=Sree+Balakrishna+Kalyana+Mandapam+Thirumala+Thiruvananthapuram",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Sree+Balakrishna+Kalyana+Mandapam+Thirumala+Thiruvananthapuram"
      }
    ]
  },

  // 5. COUNTDOWN
  countdown: {
    eyebrow: "WEDDING RECEPTION",
    title: "COUNTDOWN TO THE BIG DAY",
    subtitle: "“The blessed moment is getting closer.”",
    targetDateTimeISO: "2026-11-12T16:00:00+05:30",
    completedMessage: "THE BLESSED DAY HAS ARRIVED"
  },

  // 6. VENUE & TRAVEL
  venueAndTravel: {
    eyebrow: "VENUE GUIDE",
    title: "VENUE & LOCATION",
    subtitle: "“Save the date and join us with ease.”",
    venues: [
      {
        id: "ven-1",
        eventName: "Wedding Reception",
        date: "Thursday, November 12, 2026",
        time: "04:00 PM – 08:30 PM (1448 Rabi' al-Akhir 2)",
        venueName: "Sree Balakrishna Kalyana Mandapam",
        address: "Near Thirumala Junction, Thiruvananthapuram, Kerala",
        mapsUrl: "https://maps.google.com/?q=Sree+Balakrishna+Kalyana+Mandapam+Thirumala+Thiruvananthapuram",
        directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Sree+Balakrishna+Kalyana+Mandapam+Thirumala+Thiruvananthapuram",
        mapQuery: "Sree+Balakrishna+Kalyana+Mandapam+Thirumala+Thiruvananthapuram"
      }
    ],
    travelNotes: [
      "Sree Balakrishna Kalyana Mandapam is conveniently located near Thirumala Junction in Thiruvananthapuram, Kerala.",
      "The venue is easily accessible from Thiruvananthapuram Central Railway Station / KSRTC Bus Stand and Trivandrum International Airport.",
      "Guests are cordially invited to join the reception from 4:00 PM to 8:30 PM on Thursday, November 12th, 2026.",
      "Contact for assistance: +91 9895728351."
    ]
  },

  // 9. LIVE STREAM
  liveStream: {
    enabled: false,
    badge: "🔴 LIVE STREAM",
    title: "WATCH LIVE",
    subtitle: "Can't make it in person? Join us virtually as we celebrate this beautiful moment together.",
    streamUrl: "",
    buttonText: "JOIN LIVE STREAM",
    platform: "Live Broadcast",
    broadcastTime: "November 12, 2026 · 4:00 PM IST"
  }
};

// Initialize working dataset
window.weddingData = window.weddingDataDefault;
