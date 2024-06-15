

// Функція для перевірки
function isAdmin(userEmail) {
    return userEmail === 'admin@I';
}

// Функція для перевірки, чи кнопка вже заброньована
async function isButtonBooked(buttonId) {
    try {
        const response = await fetch('http://localhost:10000/bookings');
        const bookings = await response.json();
        const bookingIds = bookings.map(booking => booking.id);
        return bookingIds.includes(buttonId);
    } catch (error) {
        console.error('Під час отримання бронювань сталася помилка:', error);
        return false;
    }
}

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

        console.log('Деталі бронювання збережено в LocalStorage');

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
                const buttonId = button.id;
                const userEmail = localStorage.getItem('userEmail');

                // Перевіряємо, чи користувач має право на бронювання
                if ((isAdmin(userEmail) && !(await isButtonBooked(buttonId))) || !isAdmin(userEmail)) {
                    proceedBooking(button);
                } else {
                    alert("Ви вже забронювали талон або цей час вже заброньовано.");
                }
            });
        });

    } catch (error) {
        console.error('Під час отримання бронювань сталася помилка:', error);
    }
});

async function proceedBooking(button) {
    const time = button.textContent.trim();
    const day = document.querySelector('.day_body .active p').dataset.day;
    const userEmail = localStorage.getItem('userEmail'); // Отримання email з LocalStorage
    const buttonId = button.id; // Отримання id кнопки

    const bookingEmail = JSON.parse(localStorage.getItem('bookingEmail')) || [];
    const bookingIds = JSON.parse(localStorage.getItem('bookingIds')) || [];

    // Перевіряємо, чи користувач має роль "admin@I"
    if (isAdmin(userEmail)) {
        // Якщо користувач адміністратор, перевіряємо, чи кнопка вже заброньована
        if (!(await isButtonBooked(buttonId))) {
            // Якщо кнопка не заброньована, проводимо бронювання
            await bookSlot(day, time, userEmail, buttonId);
        } else {
            alert("Цей час вже заброньовано.");
        }
    } else {
        // Якщо користувач не адміністратор, перевіряємо, чи він вже має заброньований талон
        if (!bookingEmail.includes(userEmail)) {
            // Якщо користувач не має заброньованого талону, проводимо бронювання
            await bookSlot(day, time, userEmail, buttonId);
        } else {
            alert("Ви вже забронювали талон.");
        }
    }
}

async function bookSlot(day, time, userEmail, buttonId) {
    const response = await fetch(`http://localhost:10000/bd/ticket/${day.toLowerCase()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ day, time, email: userEmail, id: buttonId })
    });

    const data = await response.json();
    alert(data.message);

    if (data.message === 'Талон успішно заброньовано') {
        const bookingEmail = JSON.parse(localStorage.getItem('bookingEmail')) || [];
        const bookingIds = JSON.parse(localStorage.getItem('bookingIds')) || [];
        bookingEmail.push(userEmail);
        bookingIds.push(buttonId);
        localStorage.setItem('bookingEmail', JSON.stringify(bookingEmail));
        localStorage.setItem('bookingIds', JSON.stringify(bookingIds));
        const button = document.getElementById(buttonId);
        if (button) {
            button.classList.add('booked');
        }
        updateLocalStorage(); // Оновлення LocalStorage з даними користувача та id заброньованих слотів
    }
    location.reload();
}


  
//close
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
