

// Функція для оновлення LocalStorage з даними користувача та id заброньованих слотів
function updateLocalStorage() {
    const bookingEmail = JSON.parse(localStorage.getItem('bookingEmail')) || [];
    const bookingIds = JSON.parse(localStorage.getItem('bookingIds')) || [];
    const bookingDetails = [];

    bookingEmail.forEach((user, index) => {
        bookingDetails.push({ user, id: bookingIds[index] });
    });

}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:10000/bookings');
        const bookings = await response.json();
        
        // Оновлення LocalStorage з даними користувача та id заброньованих слотів
        const bookingEmail = bookings.map(booking => booking.user);
        const bookingIds = bookings.map(booking => booking.id);
        localStorage.setItem('bookingEmail', JSON.stringify(bookingEmail));
        localStorage.setItem('bookingIds', JSON.stringify(bookingIds));

        console.log('Booking details saved in LocalStorage');

        // Перевіряємо кожен заброньований час і ховаємо відповідну кнопку
        bookings.forEach(booking => {
            const button = document.getElementById(booking.id);
            if (button) {
                button.classList.add('booked');
            }
        });

        // Код для обробки кліків на кнопки
        document.querySelectorAll('.num_body button').forEach(button => {
            button.addEventListener('click', async () => {
                const time = button.textContent.trim();
                const day = document.querySelector('.day_body .active p').dataset.day;
                const userEmail = localStorage.getItem('userEmail'); // Отримання email з LocalStorage
                const buttonId = button.id; // Отримання id кнопки
        
                const bookingEmail = JSON.parse(localStorage.getItem('bookingEmail')) || [];
                const bookingIds = JSON.parse(localStorage.getItem('bookingIds')) || [];
        
                // Перевірка, чи кнопка вже заброньована
                if (bookingIds.includes(buttonId)) {
                    alert("Цей час вже заброньовано.");
                    return;
                }
        
                // Перевірка, чи користувач має право на бронювання
                if (bookingEmail.includes(userEmail)) {
                    alert("Ви вже забронювали талон.");
                    return;
                }
        
                const response = await fetch(`http://localhost:10000/bd/ticket/${day.toLowerCase()}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ day, time, email: userEmail, id: buttonId })
                });
        
                const data = await response.json();
                alert(data.message);
        
                // Якщо бронювання пройшло успішно, додати деталі бронювання до LocalStorage та додати клас booked до кнопки
                if (data.message === 'Талон успішно заброньовано') {
                    bookingEmail.push(userEmail);
                    bookingIds.push(buttonId);
                    localStorage.setItem('bookingEmail', JSON.stringify(bookingEmail));
                    localStorage.setItem('bookingIds', JSON.stringify(bookingIds));
                    button.classList.add('booked');
                    updateLocalStorage(); // Оновлення LocalStorage з даними користувача та id заброньованих слотів
                }
                location.reload();
            });
        });
        
    } catch (error) {
        console.error('Під час отримання бронювань сталася помилка:', error);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const clearTicketsBtn = document.getElementById('closeButton3');

    // Додаємо обробник події для кнопки
    clearTicketsBtn.addEventListener('click', () => {
        // Отримуємо значення userEmail з localStorage
        const userEmail = localStorage.getItem('userEmail');

        // Перевіряємо, чи є значення userEmail і чи воно не пусте
        if (userEmail) {
            // Формуємо новий URL з параметром email та шляхом до index.html
            const newUrl = 'http://127.0.0.1:5502/index.html?email=' + userEmail;

            // Переміщуємо користувача на новий URL
            window.location.href = newUrl;
        }
    });
});
  