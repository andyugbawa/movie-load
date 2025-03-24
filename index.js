
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Film = require("./models/movie");
const methodOverride= require("method-override")

mongoose
  .connect("mongodb://127.0.0.1:27017/movieState ", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/movies",async(req,res)=>{
    const movies = await Film.find({})
    res.render("movies/index",{movies})
})

app.get("/movies/new",async(req,res)=>{
    res.render("movies/new")
})

app.post("/movies",async(req,res)=>{
    console.log(req.body);
    const movie = new Film(req.body.movie);
    await movie.save();
    res.redirect(`/movies/${movie._id}`);
})




app.get("/movies/:id",async(req,res)=>{
    const movie = await Film.findById(req.params.id)
    res.render("movies/show",{movie})
})

app.get("/movies/:id/edit",async(req,res)=>{
    const movie = await Film.findById(req.params.id)
    res.render("movies/edit",{movie})
})

app.put("/movies/:id",async(req,res)=>{
    const {id} = req.params
    const movie = await Film.findByIdAndUpdate(id,{...req.body.movie})
    res.redirect(`/movies/${movie._id}`);
});

app.delete("/movies/:id",async(req,res)=>{
    const {id}=req.params;
    await Film.findByIdAndDelete(id)
    res.redirect("/movies")
})





app.listen(3000,()=>{
    console.log("SERVING APP 3000")
})
