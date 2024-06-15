

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
                console.error('Кнопка з ідентифікатором "clearAllBookings" не знайдена');
            }
        });
        
        function clearAllBookings() {
            fetch('http://127.0.0.1:5501/bookings', {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    alert('Усі бронювання успішно видалено');
                } else {
                    console.error('Помилка видалення всіх бронювань');
                }
            })
            .catch(error => {
                console.error('Помилка видалення всіх бронювань:', error);
            });
        }
        