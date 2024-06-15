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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const userEmail = localStorage.getItem('userEmail'); // Отримання email з LocalStorage

        // Запит на сервер для отримання даних
        const response = await fetch(`http://localhost:10000/bookings?user=${userEmail}`);
        const booking = await response.json();

        // Вставка значень day та time в HTML
        const talonDayElement = document.querySelector('.talon_day');
        const talonTimeElement = document.querySelector('.talon_time p');

        if (booking.day && booking.time) {
            talonDayElement.textContent = `День: ${booking.day}`;
            talonTimeElement.textContent = `Час: ${booking.time}`;
        } else {
            document.getElementById("talon_day").innerText = "У вас немає заброньованих талонів";
            document.getElementById("talon_time").style.display = "none";
            document.getElementById("clearTicketsBtn").style.display = "none";
        }
    } catch (error) {
        console.error('Помилка при отриманні деталей бронювання:', error);
    }
});

// Функція для видалення елементів зі списку за індексом
function removeItemByIndex(arr, index) {
    if (index > -1) {
        arr.splice(index, 1);
    }
}

// Функція для видалення бронювань користувача з localStorage
function clearUserBookingsFromLocalStorage(userEmail) {
    // Отримання поточних бронювань з localStorage
    let bookingEmails = JSON.parse(localStorage.getItem('bookingEmail')) || [];
    let bookingIds = JSON.parse(localStorage.getItem('bookingIds')) || [];

    // Визначення, яка за рахунком це бронювання для поточного користувача
    let bookingCounter = bookingEmails.findIndex(email => email === userEmail);

    if (bookingCounter !== -1) {
        // Видалення елементів зі списку bookingEmail та bookingIds за індексом bookingCounter
        removeItemByIndex(bookingEmails, bookingCounter);
        removeItemByIndex(bookingIds, bookingCounter);

        // Оновлення localStorage з оновленими списками
        localStorage.setItem('bookingEmail', JSON.stringify(bookingEmails));
        localStorage.setItem('bookingIds', JSON.stringify(bookingIds));

        console.log('Бронювання користувача успішно видалено з localStorage.');
    } else {
        console.log('Не знайдено бронювання для користувача в localStorage.');
    }
}

// Функція для видалення бронювань користувача з бази даних
async function clearUserBookingsFromDB(userEmail) {
    try {
        // Запит на сервер для видалення бронювань
        const response = await fetch(`http://localhost:10000/bookings`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: userEmail })
        });

        if (response.ok) {
            console.log('Бронювання користувача успішно видалено з бази даних.');
        } else {
            console.error('Помилка при видаленні бронювань користувача з бази даних.');
        }
    } catch (error) {
        console.error('Помилка під час видалення бронювань користувача з бази даних:', error);
    }
}

// Обробник кліків на кнопку "Cancel ticket"
document.querySelector('.your_button_talon button').addEventListener('click', async function() {
    // Отримання поточного користувача
    const userEmail = localStorage.getItem('userEmail');

    // Перевірка наявності користувача
    if (userEmail) {
        // Видалення бронювань з localStorage
        clearUserBookingsFromLocalStorage(userEmail);

        // Видалення бронювань з бази даних
        await clearUserBookingsFromDB(userEmail);

        console.log('Бронювання користувача успішно видалено.');
        // Оповіщення або подальші дії...
        location.reload();
    } else {
        console.log('Не вдалося отримати email користувача з localStorage.');
        // Повідомлення про помилку або подальші дії...
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