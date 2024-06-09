

document.getElementById("closeButton3").addEventListener("click", function() {
            window.location.href = "/index.html";
          });

          document.addEventListener('DOMContentLoaded', () => {
            const clearAllBookingsButton = document.getElementById('clearAllBookings');
            if (clearAllBookingsButton) {
                clearAllBookingsButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    clearAllBookings();
                });
            } else {
                console.error('Button with ID "clearAllBookings" not found');
            }
        });
        
        function clearAllBookings() {
            fetch('http://127.0.0.1:5501/bookings', {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    alert('All bookings have been successfully deleted');
                } else {
                    console.error('Error deleting all bookings');
                }
            })
            .catch(error => {
                console.error('Error deleting all bookings:', error);
            });
        }
        