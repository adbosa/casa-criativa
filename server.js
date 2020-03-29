// Usei o express para criar e configurar o servidor
const express = require("express")
const server = express()

// Importando banco de dados
const db = require("./db.js")

// Configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))

// Habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

// Configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true, // boolean
})

// Criei uma rota "/"
// Capturo o pedido do cliente para responder
server.get("/", function(req, res) {
    
    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        const reversedIdeas = [...rows].reverse()
        let lastIdeas = []
        
        for (idea of reversedIdeas) {
            if(lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }
        
        return res.render("index.html", { ideas: lastIdeas })
    })
})

server.get("/ideas", function(req, res) {
    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        const reversedIdeas = [...rows].reverse()
        
        return res.render("ideas.html", { ideas: reversedIdeas})
    })
})

server.post("/", function(req, res) {
    // Inserir dados
    const query = `
        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
        ) VALUES(?,?,?,?,?);`
    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link
    ]
    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }
        
        return res.redirect("/ideas")
    })
})

// Liguei meu servidor na porta 80
server.listen(80)