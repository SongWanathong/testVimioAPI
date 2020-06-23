let express = require('express')
let app = express()
let bodyparser = require('body-parser')
let axios = require('axios')
let fs = require('fs');

app.use(bodyparser.urlencoded({ extended: true }))

let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo("068e5116a3e617c7e4be2e47bbea2d46496b155f"
    , "vWxdDsUNoubjy5lO+o7V8GoQy36lgW6G+u3mMAqT546eS0ewX5gAvAtlGrbFRfmr8ZPhzBTn5Iiy/Laf5IaX7E6IftHaIGetRwUTOrOI16MtLLpwe2wSDu8psUsaX90w",
    "334b5235589c9f6949be0deb3a168a29");

client.request({
    method: 'GET',
    path: 'videos/426122758'
}, function (error, body, status_code, headers) {

    if (error) {
        console.log(error);
    }

    // console.log(body);
})


// axios.get('https://api.vimeo.com/videos/426122758').then(result => {
//     console.log(result)
// })



app.get('/', async (req, res) => {
    let file_name = "./1.mkv"
    let result
    await client.upload(
        file_name,
        {
            'name': 'Untitled',
            'description': 'The description goes here.'
        },
        function (uri) {
            console.log('Your video URI is: ' + uri);
            result = uri
            client.request(uri + '?fields=link', function (error, body, statusCode, headers) {
                if (error) {
                    console.log('There was an error making the request.')
                    console.log('Server reported: ' + error)
                    return
                }

                console.log('Your video link is: ' + body.link)
                // res.send(body.link)
                axios.get(`https://vimeo.com/api/oembed.json?url=${body.link}`).then(result => {
                    res.send(result)
                }).catch(err => {
                    res.send(err)

                })


            })
        },
        function (bytes_uploaded, bytes_total) {
            var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
            console.log(bytes_uploaded, bytes_total, percentage + '%')
        },
        function (error) {
            console.log('Failed because: ' + error)
        }
    )

})

app.get('/bye', async (req, res) => {

    client.request({
        method: 'GET',
        path: 'videos/426122758'
    }, async function (error, body, status_code, headers) {

        if (error) {
            console.log(error);
        }

        // console.log(body);
        // res.send(body)
    })

    client.request({
        method: 'POST',
        path: '/videos/426122758/pictures',
    }, async function (error, body, status_code, headers) {

        if (error) {
            console.log(error);
        }

        res.send(body)
        // res.send(body)
    })


    // const reqActiveOpts = {
    //     method: 'PATCH',
    //     url: `https://api.vimeo.com${thumbURI}`,
    //     headers: {
    //         'Authorization': `bearer ${'334b5235589c9f6949be0deb3a168a29'}`,
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/vnd.vimeo.*+json;version=3.4',
    //     },
    //     data: {
    //         active: true
    //     },
    // }
    // const thumbActiveResponse = await axios(reqActiveOpts)

    // const createThumbOpts = {
    //     method: 'POST',
    //     url: `https://api.vimeo.com/videos/426122758/pictures/904160991`,
    //     headers: {
    //         'Accept': 'application/vnd.vimeo.*+json;version=3.4',

    //         'Authorization': `bearer 334b5235589c9f6949be0deb3a168a29`
    //     },
    //     data: fs.readFileSync('./2.jpg'),
    // }
    // await axios(createThumbOpts).then(result => {
    //     console.log('1')
    //     console.log(result.data)
    // }).catch(err => {
    //     console.log('2')
    //     console.log(err)
    // })





})

app.listen(3002, () => {


    console.log('3002 is now open')
})
