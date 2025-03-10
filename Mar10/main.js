const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

class Student {
    constructor(id, mssv, hoTen, lop, isDeleted) {
        this.id = id
        this.mssv = mssv
        this.hoTen = hoTen
        this.lop = lop
        this.isDeleted = isDeleted
    }
}

let students = []

app.get('/', (req, res) => {
    res.send(students)
})

function getMax() {
    let ids = students.map(p => Number.parseInt(p.id));
    return Math.max(...ids);
}

function GenString(length) {
    let source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let index = 0; index < length; index++) {
        let rd = Math.floor(Math.random() * source.length);
        result += source.charAt(rd);
    }
    return result;
}

function GenNumber(length) {
    let source = "0123456789";
    let result = "";
    for (let index = 0; index < length; index++) {
        let rd = Math.floor(Math.random() * source.length);
        result += source.charAt(rd);
    }
    return result;
}


app.post('/', (req, res) => {
    console.log(req.body);
    let student = new Student()
    student.id = GenString(16)
    student.mssv = GenNumber(11)
    student.hoTen = req.body.hoTen
    student.lop = req.body.lop
    student.isDeleted = false
    students.push(student);
    res.send(student);
})

app.put('/:id', (req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    let student = students.find(s => s.id == id);
    let body = req.body;
    if (student) {
        //update
        if (body.hoTen) {
            student.hoTen = body.hoTen;
        }
        if (body.lop) {
            student.lop = body.lop;
        }
        res.send(student);
    } else {
        res.status(404).send({
            message: "khong tim thay id"
        })
    }
})

app.put('/delete/:id', (req, res) => {
    let id = req.params.id;
    let student = students.find(p => p.id == id);
    let body = req.body
    if (student) {
        //update
        if (body.isDeleted) {
            student.isDeleted = true
        }
        res.send(student);
    } else {
        res.status(404).send({
            message: "khong tim thay id"
        })
    }
})

// app.get('/:idhehe', (req, res) => {
//     let id = req.params.idhehe;
//     let post = posts.find(p => p.id == id);
//     if (post) {
//         res.status(200).send(post)
//     } else {
//         res.status(404).send({
//             message: "khong tim thay id"
//         })
//     }

// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})