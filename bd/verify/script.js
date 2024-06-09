document.getElementById("closeButton1").addEventListener("click", function() {
    window.location.href = "/index.html";
});

document.getElementById('verificationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = localStorage.getItem('userEmail');
    const password = localStorage.getItem('userPassword');
    const verificationCode = document.getElementById('verificationCode').value;

    fetch('http://localhost:5501/bd/verify', { // Використання порту 5500
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, verificationCode, password })
    })
    .then(response => response.text())
    .then(text => {
        if (text === "Електронна пошта успішно підтверджена") {
            alert("Код підтвердження введено правильно. Електронна пошта успішно підтверджена.");
            // Показати повідомлення про успішну підтвердження
            window.location.href = '/bd/login/login.html';
        } else {
            alert(text);
            // Показати повідомлення про помилку
        }
    })
    .catch(error => console.error('Помилка:', error));
});
