const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/',(req,res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants',(req,res) => {
  const keyword = req.query.keyword?.trim()
  // 篩所有值
  const matchedRestaurants = keyword ? restaurants.filter(rt => 
    Object.values(rt).some((property) => {
      if (typeof property === 'string') {
      return property.toLowerCase().includes(keyword.toLowerCase())
      }
      return false
    })    
  ) : restaurants

  res.render('index',{ restaurants: matchedRestaurants, keyword })


  // 用「或」的寫法 同時篩選：類別＋店名
  // const matchedRestaurants = restaurants.filter(rt => {
  //   return rt.name.toLowerCase().includes(keyword.toLowerCase()) || rt.category.toLowerCase().includes(keyword.toLowerCase())
  // })
  // res.render('index',{ restaurants: matchedRestaurants, keyword })

  // 只篩店名
  // const matchedRestaurants = restaurants.filter(rt => {
  //   return rt.name.toLowerCase().includes(keyword.toLowerCase())
  // })
  // res.render('index',{ restaurants: matchedRestaurants, keyword })
})

app.get('/restaurant/:id',(req,res) => {
  const id = req.params.id
  const restaurant = restaurants.find(rt => {
    return rt.id.toString() === id
  })
  res.render('detail',{ restaurant })
})

app.listen(port,() => {
  console.log(`express server is running on http://localhost:${port}`)
})