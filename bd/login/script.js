function isValid(input) {
    // Додайте вашу логіку валідації тут
    if (input.length < 8) {
        return false;
    }
    // Додайте вашу іншу логіку валідації тут
    return true; // Наприклад, перевірка на те, чи введення не є порожнім
}

{

    
    let inputElement = document.getElementById('loginPassword');
    let showPasswordCheckbox = document.getElementById('showPasswordCheckbox');
    
    inputElement.addEventListener('input', function(event) {
        if (!isValid(event.target.value)) {
            event.target.classList.add('invalid');
        } else {
            event.target.classList.remove('invalid');
        }
    });
    
    showPasswordCheckbox.addEventListener('change', function(event) {
        const isChecked = event.target.checked;
        if (isChecked) {
            inputElement.type = 'text';
        } else {
            inputElement.type = 'password';
        }
    });
    }

    // cancel but
    {
        document.getElementById("closeButton1").addEventListener("click", function() {
            window.location.href = "/index.html";
          });
    
    }

    document.getElementById("loginForm").addEventListener("submit", function(event) {
    
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;
    
        fetch("/bd/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json()) // Парсимо JSON відповідь
        .then(data => {
            // Після успішного входу, змінюємо вміст сторінки
            document.body.innerHTML = `<h2>Успішний вхід</h2><p>Email: ${data.email}</p>`;
            window.location.href = "/index.html?email=" + data.email;
        })
        .catch(error => {
            console.error("Помилка при вході:", error);
            alert("Помилка при вході");
        });
    
        event.preventDefault();
    });
    