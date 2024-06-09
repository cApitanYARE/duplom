/*window.onload = function() {
    function isValid(input) {
        // Валідація електронної пошти
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(input);
    
        // Перевірка допустимих доменів електронної пошти
        const validDomains = ['@gmail.com', '@ukr.net'];
        const hasValidDomain = validDomains.some(domain => input.endsWith(domain));
    
        // Повернення результату валідації
        return isValidEmail && hasValidDomain;
    }
    


// sign in
{
    

document.getElementById("closeButton2").addEventListener("click", function() {
    window.location.href = "/index.html";
});



// first pass

    let inputElement1 = document.getElementById('password');
    let inputElement2 = document.getElementById('confirmPassword');
    let showPasswordCheckbox1 = document.getElementById('showPasswordCheckbox1');
    
    inputElement1.addEventListener('input', function(event) {
        if (!isValid(event.target.value)) {
            event.target.classList.add('invalid');
        } else {
            event.target.classList.remove('invalid');
        }
    });
    
    showPasswordCheckbox1.addEventListener('change', function(event) {
        const isChecked = event.target.checked;
        if (isChecked) {
            inputElement1.type = 'text';
        } else {
            inputElement1.type = 'password';
        }
    });


//two repeat pass

    inputElement2.addEventListener('input', function(event) {
    if (!isValid(event.target.value)) {
        event.target.classList.add('invalid');
    } else {
        event.target.classList.remove('invalid');
    }
});

showPasswordCheckbox1.addEventListener('change', function(event) {
    const isChecked = event.target.checked;
    if (isChecked) {
        inputElement2.type = 'text';
    } else {
        inputElement2.type = 'password';
    }
});
}

document.getElementById("registrationForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (email.length > 30) {
        alert("Електронна пошта не може перевищувати 30 символів.");
        return;
    }

    if (password.length < 8) {
        alert("Пароль повинен містити принаймні 8 символів.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Паролі не співпадають");
        return;
    }

    // Відправити дані на сервер (наприклад, з використанням AJAX або Fetch API)
    // Приклад:
    fetch("http://localhost:5501/bd/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Помилка при реєстрації");
        }
        alert("Реєстрація успішна");
        // Очистити форму
        document.getElementById("registrationForm").reset();
        window.location.href = "/bd/login/login.html";
    })

    .catch(error => {
        alert(error.message);
    });
});

};*/

// script.js
window.onload = function() {
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPassword(password) {
        return password.length >= 8;
    }

    function isValid() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        const isValidEmailFormat = isValidEmail(email);
        const isValidPasswordLength = isValidPassword(password);
        const passwordsMatch = password === confirmPassword;

        if (!isValidEmailFormat) {
            alert("Неправильний формат електронної пошти.");
            return false;
        }

        if (!isValidPasswordLength) {
            alert("Пароль повинен містити принаймні 8 символів.");
            return false;
        }

        if (!passwordsMatch) {
            alert("Паролі не співпадають.");
            return false;
        }

        return true;
    }

    document.getElementById("registrationForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!isValid()) {
            return;
        }

        // Зберігаємо значення електронної пошти та пароля в localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);

        // Відправити дані на сервер (наприклад, з використанням AJAX або Fetch API)
        fetch("http://localhost:5501/bd/signin", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.text())
        .then(text => {
            alert(text);
            // Перенаправлення на сторінку /verify/index.html
            window.location.href = '/bd/verify/index.html';
        })
        .catch(error => console.error('Помилка:', error));
    });

    document.getElementById("closeButton2").addEventListener("click", function() {
        window.location.href = "/index.html";
    });

    const inputElement1 = document.getElementById('password');
    const inputElement2 = document.getElementById('confirmPassword');
    const showPasswordCheckbox1 = document.getElementById('showPasswordCheckbox1');

    inputElement1.addEventListener('input', function(event) {
        if (!isValidPassword(event.target.value)) {
            event.target.classList.add('invalid');
        } else {
            event.target.classList.remove('invalid');
        }
    });

    inputElement2.addEventListener('input', function(event) {
        if (!isValidPassword(event.target.value)) {
            event.target.classList.add('invalid');
        } else {
            event.target.classList.remove('invalid');
        }
    });

    showPasswordCheckbox1.addEventListener('change', function(event) {
        const isChecked = event.target.checked;
        if (isChecked) {
            inputElement1.type = 'text';
            inputElement2.type = 'text';
        } else {
            inputElement1.type = 'password';
            inputElement2.type = 'password';
        }
    });
};