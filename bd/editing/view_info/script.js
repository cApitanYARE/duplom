document.getElementById("closeButton3").addEventListener("click", function() {
    window.location.href = "/bd/editing/index.html";
  });

  document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:5501/bookings')
        .then(response => response.json())
        .then(data => {
            const bookingContent = document.getElementById('bookingContent');
            bookingContent.innerHTML = '';

            data.forEach(booking => {
                const bookingDiv = document.createElement('div');
                bookingDiv.classList.add('booking-detail');
                bookingDiv.innerHTML = `
                <div>
                    <p>User: ${booking.user}</p>
                    <p>Day: ${booking.day}</p>
                    <p>Time: ${booking.time}</p>
                </div>
                    <div style="display: flex; justify-content: end; flex: 1;">
                    <button class="delete-button" data-id="${booking.id}">Скасувати</button>
                    </div>
                `;
                bookingContent.appendChild(bookingDiv);
            });

            // Attach event listeners to delete buttons
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const bookingId = event.target.getAttribute('data-id');
                    deleteBooking(bookingId);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching bookings:', error);
        });
});

function deleteBooking(bookingId) {
    fetch(`http://127.0.0.1:5501/bookings/${bookingId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            document.querySelector(`button[data-id="${bookingId}"]`).parentElement.remove();
        } else {
            console.error('Помилка видалення бронювання');
        }
    })
    .catch(error => {
        console.error('Помилка видалення бронювання:', error);
    });
}
