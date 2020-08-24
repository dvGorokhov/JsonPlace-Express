const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 5000
const app = express()

app.set("json spaces", 2)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.send("Welcome to your App!")
})
// гет запрос
// app.get("/getData", (req, res) => {
//     axios.get("https://jsonplaceholder.typicode.com/posts")
//         .then(function (response) {
//             res.json(response.data)
//         }).catch(function (error) {
//             res.json("Error occured!")
//         })
// })

// самы длинный пост
app.post("/maxBodyPost", (req, res) => {

    axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(function (response) {
            const startPosts = new Date().getTime();
            let postBody = response.data;
            let userId;
            let count = 0;
            let post;

            postBody.forEach(function (item) {
                let str = item.body.toLocaleLowerCase().replace(/[^A-Za-zА-Яа-яЁё ]/g, "");
                let arr = str.split(' ');
                if (arr.length > count) {
                    count = arr.length;
                    userId = item.userId;
                    post = item;
                }
            });
            const endPosts = new Date().getTime();
            a = {
                userId: userId, wordCount: count, post: post, time: `${endPosts - startPosts}ms`
            }

            res.json(a)
        }).catch(function (error) {
            res.json("Error occured!")
        })
})

// топ 5 встречающихся слов
app.post("/top5", (req, res) => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
        .then(function (response) {
            const startTop = new Date().getTime();
            let postBody = response.data;
            let masWords = [];
            let masCounts = [];

            postBody.forEach(function (item) {
                let str = item.body.toLocaleLowerCase().replace(/[^A-Za-zА-Яа-яЁё ]/g, "");
                let arr = str.split(' ');
                arr.forEach(function (i) {
                    if (masWords.includes(i)) {
                        let k = masWords.indexOf(i)
                        masCounts[k] += 1
                    }
                    else {
                        masWords.push(i)
                        masCounts.push(1)
                    }
                })
            })

            let top = [];

            masWords.forEach(function (item, i) {
                top.push({ word: item, count: masCounts[i] })
            })
            top.sort((a, b) => b.count - a.count)


            top = top.slice(0, 5);
            const endTop = new Date().getTime();
            top5 = {
                top: top, time: `${endTop - startTop}ms`
            }

            res.json(top5)

        })
        .catch(function (error) {
            res.json("Error occured!")
        })

})


app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`)
})