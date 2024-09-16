
const http = require("http");
const fs = require("fs");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

let tempOverview = fs.readFileSync("./templates/overview.html", "utf-8");
let tempProduct = fs.readFileSync("./templates/product.html", "utf-8");
let tempCard = fs.readFileSync("./templates/card.html", "utf-8")


// json datas
let jsonData = fs.readFileSync("./dev-data/data.json", "utf-8");
let data = JSON.parse(jsonData);


const serverBen = http.createServer((request, response) => {
    console.log("API'a istek geldi!!", request.url);

    const { query, pathname } = url.parse(request.url, true);

    switch (pathname) {
        case "/overview":
            // meyveler dizisibdeki eleman sayısı kadar kart oluştur
            const cards = data.map((el) => replaceTemplate(tempCard, el));

            // anasayfa html'indeki kartlar alanına kart html kodlarını ekle
            tempOverview = tempOverview.replace("{%PRODUCT_CARDS%}", cards);

            return response.end(tempOverview);

        case "/product":
            // 1) dizideki doğru elemanı bul
            const item = data.find((item) => item.id == query.id);

            // 2) detay sayfasının html'ini bulunan elemanın verilerine göre güncelle
            const output = replaceTemplate(tempProduct, item);

            // 3) güncel html'i client'a gönder
            return response.end(output);

        default:
            return response.end("<h1>Tanimlanmayan Yol </h1>");
    }
});

serverBen.listen(3535, "127.0.0.1", () => {
    console.log("IP adresi 3535 portuna gelen istek dinlemeye alindi!");
});