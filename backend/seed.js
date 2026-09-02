const mongoose = require('mongoose');
require('dotenv').config();

const Food = require('./models/Food');

const foods = [
  {
    name: "Burger",
    price: 120,
    category: "Fast Food",
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349"
  },
  {
    name: "Pizza",
    price: 250,
    category: "Fast Food",
    img: "https://images.unsplash.com/photo-1548365328-9f547fb0953d"
  },
  {
    name: "Biryani",
    price: 180,
    category: "Indian",
    img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398"
  },
  {
    name: "Pasta",
    price: 200,
    category: "Italian",
    img: "https://images.unsplash.com/photo-1521389508051-d7ffb5dc8a2e"
  },
  {
    name: "Sandwich",
    price: 100,
    category: "Fast Food",
    img: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f"
  },
  {
    name: "Fried Rice",
    price: 150,
    category: "Chinese",
    img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b"
  },
  {
    name: "Noodles",
    price: 140,
    category: "Chinese",
    img: "https://images.unsplash.com/photo-1585032226651-759b368d7246"
  },
  {
    name: "Paneer",
    price: 220,
    category: "Indian",
    img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7"
  },
  {
    name: "Chicken Curry",
    price: 240,
    category: "Indian",
    img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
  },
  {
    name: "Dosa",
    price: 90,
    category: "South Indian",
    img: "https://images.unsplash.com/photo-1589308078054-8327b7b4fcb5"
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Food.deleteMany(); // clear old data
    await Food.insertMany(foods);

    console.log("✅ Data seeded successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedDB();