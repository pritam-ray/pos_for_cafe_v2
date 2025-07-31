export interface MenuItem {
  name: string;
  price: number;
  image: string;
}

export const menuData = {
  "Starters": {
    note: "Perfect appetizers to start your meal",
    items: [
      {
        name: "Paneer Tikka",
        price: 180,
        image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Chicken Wings",
        price: 220,
        image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Veg Spring Rolls",
        price: 150,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  "Main Course": {
    note: "Hearty meals to satisfy your hunger",
    items: [
      {
        name: "Butter Chicken",
        price: 280,
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Dal Makhani",
        price: 200,
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Biryani",
        price: 250,
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  "Beverages": {
    note: "Refreshing drinks to complement your meal",
    items: [
      {
        name: "Masala Chai",
        price: 40,
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Fresh Lime Soda",
        price: 60,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Mango Lassi",
        price: 80,
        image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  "Desserts": {
    note: "Sweet endings to your perfect meal",
    items: [
      {
        name: "Gulab Jamun",
        price: 120,
        image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Ice Cream",
        price: 100,
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Chocolate Cake",
        price: 150,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80"
      }
    ]
  }
};