const express = require('express')
const app = express()
const cors = require("cors")
const { traerDatosJoyas, traerDatosJoyasPorFiltro, traerDatosJoyaPorId, traerDatosJoyasPorOrden, prepararHATEOAS } = require('./consultas')
port = 3000

app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`Server listen on port http://localhost:${port}`)
})

app.get("/", async (req, res) => {
    try {
        res.send("Holi")
    } catch (error) {
        res.status(500).send({ message: "Ups, algo salio mal", error })
    }

})

app.get("/joyas", async (req, res) => {
    try {
        const queryStrings = req.query;
        const joyas = await traerDatosJoyas(queryStrings);
        const HATEOAS = await prepararHATEOAS(joyas)
        res.json(HATEOAS);
    } catch (error) {
        res.status(500).send({ message: "Ups, algo salio mal", error })
    }
});

app.get("/joyas/filtros", async (req, res) => {
    try {
        const query = req.query
        const datos = await traerDatosJoyasPorFiltro(query)
        res.json(datos)
    } catch (error) {
        res.status(500).send({ message: "Ups, algo salio mal", error })
    }

})

app.get("/joyas/orden", async (req, res) => {
    try {
        const query = req.query
        const datos = await traerDatosJoyasPorOrden(query)
        res.json(datos)
    } catch (error) {
        res.status(500).send({ message: "Ups, algo salio mal", error })
    }

})

app.get("/joyas/joya/:id", async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        const datos = await traerDatosJoyaPorId(id)
        res.json(datos)
    } catch (error) {
        res.status(500).send({ message: "Error al obtener los datos de la joya", error })
    }
})

