/*document.addEventListener('DOMContentLoaded', async () => {

  try {
      // Отримуємо збережені талони з localStorage
      const bookedTickets = JSON.parse(localStorage.getItem('bookedTickets')) || [];

      // Ховаємо кнопки для заброньованих талонів
      bookedTickets.forEach(ticket => {
          const button = document.getElementById(ticket.buttonId);
          if (button) {
              button.style.display = 'none';
          }
      });
  } catch (error) {
      console.error('Error occurred while loading booked tickets from localStorage:', error);
  }
});

document.getElementById('time9').addEventListener('click', async () => {
  const response = await fetch('http://localhost:3000/monday', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ day: 'Monday', time: '9:00' })
  });
  const data = await response.json();
  alert(data.message);

  // Зберігаємо заброньований талон в localStorage
  if (data.message === 'Slot booked successfully') {
      const bookedTickets = JSON.parse(localStorage.getItem('bookedTickets')) || [];
      bookedTickets.push({ buttonId: 'time9' });
      localStorage.setItem('bookedTickets', JSON.stringify(bookedTickets));

      // Зробити кнопку невидимою після успішного бронювання
      document.getElementById('time9').style.display = 'none';
  }
});*/

/*document.addEventListener('DOMContentLoaded', async () => {
  try {
      const response = await fetch('http://localhost:5501/bookings');
      const bookings = await response.json();
      
      localStorage.setItem('bookingIds', JSON.stringify(bookings));
      console.log('IDs збережено в LocalStorage:', bookings);

      // Перевіряємо кожен заброньований час і ховаємо відповідну кнопку
      bookings.forEach(booking => {
          const { time } = booking;
          const buttonId = `time${time.replace(':', '')}`;
          const button = document.getElementById(buttonId);
          if (button) {
            button.classList.add('booked');
          }
      });

      // Перевіряємо localStorage та приховуємо кнопки відповідно
      const bookedTickets = JSON.parse(localStorage.getItem('bookedTickets')) || [];
      bookedTickets.forEach(ticket => {
          const button = document.getElementById(ticket.buttonId);
          if (button) {
                button.classList.add('booked');
          }
      });
  } catch (error) {
      console.error('Error occurred while fetching bookings:', error);
  }
});

document.querySelectorAll('.num_body button').forEach(button => {
    button.addEventListener('click', async () => {
        const time = button.textContent.trim();
        const day = document.querySelector('.day_body .active p').dataset.day;
        const userEmail = localStorage.getItem('userEmail'); // Отримання email з localStorage
        const buttonId = button.id; // Отримання id кнопки


        // Перевірка, чи вже є заброньований квиток у localStorage
        const bookedTicket = JSON.parse(localStorage.getItem('bookedTicket'));
        if (bookedTicket) {
            alert("Ви вже забронювали квиток.");
            return;
        }

        const response = await fetch(`http://localhost:5501/bd/ticket/${day.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ day, time, email: userEmail, id: buttonId  })
        });

        const data = await response.json();
        alert(data.message);

        // Зберігаємо заброньований квиток в localStorage
        if (data.message === 'Slot booked successfully') {
            localStorage.setItem('bookedTicket', JSON.stringify({ day, time }));
            // Приховуємо кнопку після успішного бронювання
            button.classList.add('booked');
        }
    });
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
            const newUrl = 'http://127.0.0.1:5501/index.html?email=' + userEmail;

            // Переміщуємо користувача на новий URL
            window.location.href = newUrl;
        }
    });
});


*/


/*
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5501/bookings');
        const bookings = await response.json();
        
        localStorage.setItem('bookingIds', JSON.stringify(bookings));
        console.log('IDs збережено в LocalStorage:', bookings);

        // Перевіряємо кожен заброньований час і ховаємо відповідну кнопку
        bookings.forEach(id => {
            const button = document.getElementById(id);
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

                const bookingIds = JSON.parse(localStorage.getItem('bookingIds')) || [];

                // Перевірка, чи кнопка вже заброньована
                if (bookingIds.includes(buttonId)) {
                    alert("Цей час вже заброньовано.");
                    return;
                }

                const response = await fetch(`http://localhost:5501/bd/ticket/${day.toLowerCase()}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ day, time, email: userEmail, id: buttonId })
                });

                const data = await response.json();
                alert(data.message);

                // Якщо бронювання пройшло успішно, додати id до LocalStorage та додати клас booked до кнопки
                if (data.message === 'Slot booked successfully') {
                    bookingIds.push(buttonId);
                    localStorage.setItem('bookingIds', JSON.stringify(bookingIds));
                    button.classList.add('booked');
                }
            });
        });
    } catch (error) {
        console.error('Error occurred while fetching bookings:', error);
    }
});*/




// Функція для перевірки, чи користувач має роль "admin@I"
function isAdmin(userEmail) {
    return userEmail === 'admin@I';
}

// Функція для перевірки, чи кнопка вже заброньована
async function isButtonBooked(buttonId) {
    try {
        const response = await fetch('http://localhost:5501/bookings');
        const bookings = await response.json();
        const bookingIds = bookings.map(booking => booking.id);
        return bookingIds.includes(buttonId);
    } catch (error) {
        console.error('Error occurred while fetching bookings:', error);
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
        const response = await fetch('http://localhost:5501/bookings');
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
        console.error('Error occurred while fetching bookings:', error);
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
    const response = await fetch(`http://localhost:5501/bd/ticket/${day.toLowerCase()}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ day, time, email: userEmail, id: buttonId })
    });

    const data = await response.json();
    alert(data.message);

    if (data.message === 'Slot booked successfully') {
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
  