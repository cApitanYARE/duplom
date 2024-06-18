
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 10000;

// Підключення до локальної бази даних MongoDB для "authorizations"
mongoose.connect("mongodb+srv://absoluterepaircar:cXP436QyuuJJXUaX@authorizations.gxre9d4.mongodb.net/?retryWrites=true&w=majority&appName=authorizations", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Підключено до MongoDB для authorizations"))
    .catch(err => console.error("Помилка підключення до MongoDB для authorizations:", err));

    // Створення схеми користувача для "authorizations"
const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'user' } // додали поле role
});

// Створення моделі користувача для "authorizations"
const User = mongoose.model("User", userSchema);

app.use(cors());
app.use(bodyParser.json());


// Створення адміністратора при запуску сервера
async function createAdmin() {
    const adminEmail = "admin@I";
    const adminPassword = "adminhere";

    try {
        let admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            admin = new User({ email: adminEmail, password: adminPassword, role: 'admin' });
            await admin.save();
            console.log("Адміністратор створений з email: admin@ та паролем: adminhere");
        } else {
            console.log("Адміністратор вже існує");
        }
    } catch (error) {
        console.error("Помилка при створенні адміністратора:", error);
    }
}


createAdmin();


// Endpoints для "authorizations"
app.post("/bd/signin", (request, response) => {
    const { email, password } = request.body;
    const verificationCode = crypto.randomBytes(3).toString('hex'); // Генеруємо 6-значний код підтвердження

    const newUser = new User({ email, password });

    // Зберігаємо нового користувача лише якщо код підтвердження буде підтверджено
    sendVerificationEmail(email, verificationCode)
    .then(() => {
        response.status(200).send("Код підтвердження надіслано на вашу електронну пошту.");
    })
    .catch(err => {
        console.error("Помилка при відправці коду підтвердження:", err);
        response.status(500).send("Помилка сервера");
    });
});

app.post("/bd/verify", async (request, response) => {
    try {
        const { email, verificationCode, password } = request.body;

        // Перевірка, чи введений код підтвердження не порожній та є рядком
        if (!verificationCode || typeof verificationCode !== 'string') {
            return response.status(400).send("Невірний код підтвердження");
        }



        // Пошук користувача за email в базі даних
        let user = await User.findOne({ email: email });

        // Якщо користувач з таким email не знайдений, створіть нового користувача
        if (!user) {
            user = new User({ email: email, password: password, isVerified: true });
        } else {
            // Якщо користувач з таким email вже існує, перевірте, чи він ще не підтверджений
            if (user.isVerified) {
                return response.status(400).send("Користувач з цією електронною поштою вже підтверджений");
            }
            // Оновлення пароля користувача
            user.password = password;
            // Позначаємо користувача як підтвердженого
            user.isVerified = true;
        }

        // Видаляємо код підтвердження
        user.verificationCode = null;

        // Зберігаємо або оновлюємо дані користувача в базі даних
        await user.save();

        // Відправляємо відповідь, якщо підтвердження успішне
        response.status(200).send("Електронна пошта успішно підтверджена");
    } catch (error) {
        console.error("Помилка при підтвердженні електронної пошти:", error);
        response.status(500).send("Помилка сервера");
    }
});

app.post("/bd/login", (request, response) => {
    const { email, password } = request.body;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return response.status(404).send("Користувач не знайдений");
            }

            if (user.password !== password) {
                return response.status(401).send("Невірний пароль");
            }

            response.status(200).json({ message: "Успішний вхід", email: user.email, role: user.role });
        })
        .catch(err => {
            console.error("Помилка при вході:", err);
            response.status(500).send("Помилка сервера");
        });
});




app.post("/take_talon", async (req, res) => {
    const { time, email } = req.body;

    try {
        // Перевіряємо, чи користувач вже має заброньований талон
        const existingTalon = await Talon.findOne({ email: email });
        if (existingTalon) {
            console.error(`Користувач ${email} вже забронював талон`);
            return res.status(400).send("Ви вже забронювали талон");
        }

        // Оновлюємо талон, якщо він вільний
        const updatedTalon = await Talon.findOneAndUpdate(
            { time: time, email: null }, // Оновлюємо талон, якщо email === null
            { email: email },
            { new: true }
        );

        if (!updatedTalon) {
            console.error(`Талон на ${time} вже заброньований`);
            return res.status(400).send("Талон вже заброньований");
        }

        console.log(`Талон на ${time} заброньований для користувача ${email}`);
        res.sendStatus(200);
    } catch (error) {
        console.error("Помилка при бронюванні талона2:", error);
        res.status(500).send("Помилка сервера");
    }
});


const bookingSchema = new mongoose.Schema({
    day: String,
    time: String,
    booked: Boolean,
    user: String, // нове поле для користувача
    id: String // нове поле для id кнопки
});

// Створення моделі бронювань для "bookingDB"
const Booking = mongoose.model('Booking', bookingSchema);

app.use(cors());
// Middleware
app.use(bodyParser.json());


// Налаштування Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'absoluterepaircar@gmail.com',
        pass: 'qykr wnxm qhja oein'
    }
});

// Функція для надсилання електронної пошти з підтвердженням
function sendVerificationEmail(userEmail, verificationCode) {
    const mailOptions = {
        from: 'absoluterepaircar@gmail.com',
        to: userEmail,
        subject: 'Підтвердження реєстрації',
        text: `Дякуємо за реєстрацію. Будь ласка, підтвердіть свою електронну адресу за допомогою цього коду: ${verificationCode}`
    };

    return transporter.sendMail(mailOptions)
    .catch(err => {
        console.error("Помилка при відправці електронної пошти:", err);
        throw err; // Передаємо помилку далі, щоб її можна було обробити в обробнику запиту /signin
    });
}

app.post("/bd/ticket/monday", async (req, res) => {
    const { day, time, email, id } = req.body;

    try {
        const existingBooking = await Booking.findOne({ day, time });
        if (existingBooking) {
            res.status(409).json({ message: 'This slot is already booked' });
        } else {
            await Booking.create({ day, time, booked: true, user: email, id });
            res.status(200).json({ message: 'Slot booked successfully' });
        }
    } catch (error) {
        console.error('Error occurred while booking slot:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/bd/ticket/wednesday', async (req, res) => {
    const { day, time, email, id } = req.body;

    try {
        const existingBooking = await Booking.findOne({ day, time });
        if (existingBooking) {
            res.status(409).json({ message: 'This slot is already booked' });
        } else {
            await Booking.create({ day, time, booked: true, user: email, id });
            res.status(200).json({ message: 'Slot booked successfully' });
        }
    } catch (error) {
        console.error('Error occurred while booking slot:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/bd/ticket/tuesday', async (req, res) => {
    const { day, time, email, id } = req.body;

    try {
        const existingBooking = await Booking.findOne({ day, time });
        if (existingBooking) {
            res.status(409).json({ message: 'This slot is already booked' });
        } else {
            await Booking.create({ day, time, booked: true, user: email, id });
            res.status(200).json({ message: 'Slot booked successfully' });
        }
    } catch (error) {
        console.error('Error occurred while booking slot:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/bd/ticket/thursday', async (req, res) => {
    const { day, time, email, id } = req.body;

    try {
        const existingBooking = await Booking.findOne({ day, time });
        if (existingBooking) {
            res.status(409).json({ message: 'This slot is already booked' });
        } else {
            await Booking.create({ day, time, booked: true, user: email, id });
            res.status(200).json({ message: 'Slot booked successfully' });
        }
    } catch (error) {
        console.error('Error occurred while booking slot:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/bd/ticket/friday', async (req, res) => {
    const { day, time, email, id } = req.body;

    try {
        const existingBooking = await Booking.findOne({ day, time });
        if (existingBooking) {
            res.status(409).json({ message: 'This slot is already booked' });
        } else {
            await Booking.create({ day, time, booked: true, user: email, id });
            res.status(200).json({ message: 'Slot booked successfully' });
        }
    } catch (error) {
        console.error('Error occurred while booking slot:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/*
app.get('/bookings', async (req, res) => {
    try {
        const allBookings = await Booking.find({}, 'id');
        res.status(200).json(allBookings.map(booking => booking.id));
    } catch (error) {
        console.error('Error occurred while fetching all booking IDs:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});*/

/*
app.get('/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find({ booked: true });
        const bookingDetails = bookings.map(booking => ({
            id: booking.id,
            user: booking.user
        }));
        res.status(200).json(bookingDetails);
    } catch (error) {
        console.error('Error occurred while fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});*/
/*
app.get('/bookings', async (req, res) => {
    const userEmail = req.query.user;

    try {
        const booking = await Booking.findOne({ user: userEmail });
        
        if (booking) {
            res.status(200).json(booking);
        } else {
            res.status(404).json({ message: 'Booking not found for this user' });
        }
    } catch (error) {
        console.error('Error occurred while fetching booking details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});*/
/*
app.get('/bookings', async (req, res) => {
    const userEmail = req.query.user;

    try {
        const booking = await Booking.findOne({ user: userEmail, booked: true });

        if (booking) {
            res.status(200).json({ day: booking.day, time: booking.time });
        } else {
            res.status(404).json({ message: 'Для цього користувача немає заброньованих талонів' });
        }
    } catch (error) {
        console.error('Помилка при отриманні талону:', error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
}); 


app.get('/bookings', async (req, res) => {
    const userEmailParam = req.query.user;

    try {
        if (userEmailParam) {
            const userBookings = await Booking.find({ user: userEmailParam });
        
            if (userBookings.length > 0) {
                res.status(200).json(userBookings);
            } else {
                res.status(404).json({ message: 'Бронювання не знайдені для цього користувача' });
            }
        } else {
            const allBookings = await Booking.find({ booked: true });
            const allBookingDetails = allBookings.map(booking => ({
                id: booking.id,
                user: booking.user,
                day: booking.day,
                time: booking.time,
                booked: booking.booked
            }));
            res.status(200).json(allBookingDetails);
        }
    } catch (error) {
        console.error('Помилка при отриманні деталей бронювання:', error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
});*/

app.get('/bookings', async (req, res) => {
    const userEmail = req.query.user;

    try {
        if (userEmail) {
            const userBooking = await Booking.findOne({ user: userEmail, booked: true });

            if (userBooking) {
                res.status(200).json({ day: userBooking.day, time: userBooking.time });
            } else {
                res.status(404).json({ message: 'Для цього користувача немає заброньованих талонів' });
            }
        } else {
            const allBookings = await Booking.find({ booked: true });
            const allBookingDetails = allBookings.map(booking => ({
                id: booking.id,
                user: booking.user,
                day: booking.day,
                time: booking.time,
                booked: booking.booked
            }));
            res.status(200).json(allBookingDetails);
        }
    } catch (error) {
        console.error('Помилка при отриманні деталей бронювання:', error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
});

app.get('/bookings', async (req, res) => {
    try {
        const allBookings = await Booking.find({ booked: true });
        res.status(200).json(allBookings);
    } catch (error) {
        console.error('Error occurred while fetching bookings:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/bookings/:id', async (req, res) => {
    const bookingId = req.params.id;

    try {
        const deletedBooking = await Booking.findOneAndDelete({ id: bookingId });
        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Error occurred while deleting booking:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/bookings', async (req, res) => {
    const { user, day, time } = req.body;

    try {
        const existingBooking = await Booking.findOne({ user: user, booked: true });

        if (existingBooking) {
            res.status(400).json({ message: 'Користувач вже має активне бронювання' });
        } else {
            const newBooking = new Booking({
                user: user,
                day: day,
                time: time,
                booked: true
            });

            await newBooking.save();
            res.status(201).json({ message: 'Бронювання успішно створено' });
        }
    } catch (error) {
        console.error('Помилка при створенні бронювання:', error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
});

// Маршрут для видалення всіх бронювань
app.delete('/bookings', async (req, res) => {
    try {
        await Booking.deleteMany({});
        res.status(200).send({ message: 'All bookings deleted successfully' });
    } catch (error) {
        console.error('Error occurred while deleting all bookings:', error);
        res.status(500).send({ error: 'An error occurred while deleting all bookings' });
    }
});


app.delete('/bookings', async (req, res) => {
    const userEmail = req.body.user;

    try {
        // Видалення записів з бази даних, де user = userEmail
        await Booking.deleteMany({ user: userEmail });
        res.status(200).json({ message: 'Бронювання користувача успішно видалено' });
    } catch (error) {
        console.error('Помилка при видаленні бронювань користувача з бази даних:', error);
        res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
});



app.listen(PORT, '0.0.0.0' ,() => {
    console.log(`Сервер працює на http://localhost:${PORT}`);
});
