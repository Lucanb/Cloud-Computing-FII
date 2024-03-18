import express from "express";
import cors from "cors";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const app = express();
const port = 5000;

app.use(cors());

// app.get('/api/todos', (req, res) => {
//     return res.json({
//         todos: [
//             {
//                 title: "task1",
//             },
//             {
//                 title: "task2",
//             },
//             {
//                 title: "task3",
//             }
//         ]
//     });
// });

app.post('/signup', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
            });
        res.redirect('/');
    } catch (e) {
        res.redirect('signup');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
    res.redirect('/');
});

app.get('/logout', function (req, res) {
    auth.signOut().then(() => {
        res.redirect('/login');
    }).catch((error) => {
        // An error happened.
    });
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
