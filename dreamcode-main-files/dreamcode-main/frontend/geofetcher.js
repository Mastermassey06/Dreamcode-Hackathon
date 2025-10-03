


    document.getElementById('fetchDataButton').addEventListener('click', async function() {
      // Geolocation to get user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          
          // Outputting the latitude and longitude to the pre element
          document.getElementById('output').textContent = `Latitude: ${lat}, Longitude: ${long}`;
        }, function(error) {
          // Handle geolocation errors
          document.getElementById('output').textContent = 'Error getting location: ' + error.message;
        });
      } else {
        // Geolocation is not supported by the browser
        document.getElementById('output').textContent = 'Geolocation is not supported by this browser.';
      }
    });
 