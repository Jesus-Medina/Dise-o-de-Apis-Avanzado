const { Pool } = require("pg");
const format = require("pg-format")

const clienteDB = new Pool({
    user: "postgres",
    host: "localhost",
    password: "postgres",
    database: "joyas",
    port: 5432,
    allowExitOnIdle: true
});


const traerDatosJoyas = async () => {
    const consulta = "SELECT * FROM inventario"
    const { rows: joyas } = await clienteDB.query(consulta)

    return joyas
}

const traerDatosJoyasPorOrden = async ({ limits = 5, order_by = "id_ASC", page = 1 }) => {
    const [campo, direccion] = order_by.split("_")
    const offset = (page - 1) * limits
    const formatedquery = format("SELECT * FROM inventario ORDER BY %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset)
    const { rows: joyas } = await clienteDB.query(formatedquery)
    return joyas
}

const traerDatosJoyaPorId = async (id) => {
    const consulta = "SELECT * FROM inventario WHERE id = $1"
    const values = [id]
    const {rows: joya} = await clienteDB.query(consulta, values)

    return joya
}

const traerDatosJoyasPorFiltro = async ({ precio_min, precio_max, categoria, metal }) => {
    let filtros = []
    if (precio_min)
        filtros.push(`precio >= ${precio_min}`)
    if (precio_max)
        filtros.push(`precio <= ${precio_max}`)
    if (categoria)
        filtros.push(`categoria = '${categoria}'`)
    if (metal)
        filtros.push(`metal = '${metal}'`)

    let consulta = "SELECT * FROM inventario"
    if (filtros.length > 0) {
        filtros = filtros.join(" AND ")
        consulta = consulta + ` WHERE ${filtros}`
    }

    const { rows: joyas } = await clienteDB.query(consulta)
    return joyas
}

const prepararHATEOAS = (joyas) => {
    const results = joyas.map((joya) => {
        return {
            name: joya.nombre,
            href: `http://localhost:3000/joyas/joya/${joya.id}`,
        }
    }).slice(0, 8)
    const total = joyas.length
    const HATEOAS = {
        total,
        results
    }
    return HATEOAS
}

module.exports = { traerDatosJoyas, traerDatosJoyasPorOrden, traerDatosJoyaPorId, traerDatosJoyasPorFiltro, prepararHATEOAS }