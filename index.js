const express = require('express')
const app = express()
const userRoutes = require('./routes/users')
const productRoutes = require('./routes/products')
const categoryRoutes = require('./routes/category')
const subcategoryRoutes = require('./routes/subcategory')
const cors = require('cors')
const connectDB = require('./config/db')

require('dotenv').config()
connectDB()

app.use(cors())
app.use(express.json())

//3. Rutas
app.use('/usuario', userRoutes)
app.use('/producto', productRoutes)
app.use('/categoria', categoryRoutes)
app.use('/subcategoria', subcategoryRoutes)


app.get('/', (req, res) => res.send('MELL API'))

// 4. SERVIDOR
app.listen(process.env.PORT, () => {
	console.log('El servidor está corriendo en 4000')
})
