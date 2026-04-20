import { getInventory } from './inventoryService';

export const CATEGORIES = [
  "Soups",
  "Sandwiches",
  "Value Meals",
  "Breakfast",
  "Vegetables",
  "Pork",
  "Chicken",
  "Seafood",
  "Appetizers",
  "Rice",
  "Salads",
  "Beverages"
];

const defaultProducts = [
  { id: 1, name: "Sizzling Sisig", price: 185, category: "Pork", stock: 100, image: "/images/products/sisig.jpg", inventoryLinkId: null, status: 'Available' },
  { id: 2, name: "Signature Wings", price: 165, category: "Chicken", stock: 100, image: "/images/products/wings.jpg", inventoryLinkId: 'inv_1', status: 'Available' },
  { id: 3, name: "Premium Dried Pusit", price: 150, category: "Seafood", stock: 20, image: "/images/products/pusit.jpg", inventoryLinkId: 'inv_2', status: 'Available' },
  { id: 4, name: "DXN Lingzhi Coffee", price: 550, category: "Beverages", stock: 15, image: "/images/products/coffee.jpg", inventoryLinkId: 'inv_3', status: 'Available' },
  { id: 6, name: "CupEat Milktea", price: 85, category: "Beverages", stock: 50, image: "/images/products/milktea.jpg", inventoryLinkId: 'inv_4', status: 'Available' },
  { id: 7, name: "Grilled Platter", price: 450, category: "Value Meals", stock: 30, image: "/images/products/platter.jpg", inventoryLinkId: null, status: 'Available' },
  { id: 8, name: "Bucket Deal (Beer)", price: 350, category: "Beverages", stock: 20, image: "/images/products/beer.jpg", inventoryLinkId: null, status: 'Available' },
  { id: 9, name: "Egg & Toast", price: 120, category: "Breakfast", stock: 50, image: "https://picsum.photos/seed/eggs/400/400", inventoryLinkId: null, status: 'Available' },
  { id: 10, name: "Clubhouse Sandwich", price: 145, category: "Sandwiches", stock: 30, image: "https://picsum.photos/seed/sandwich/400/400", inventoryLinkId: null, status: 'Available' },
  { id: 11, name: "Bulalo Soup", price: 280, category: "Soups", stock: 15, image: "https://picsum.photos/seed/soup/400/400", inventoryLinkId: null, status: 'Available' },
  { id: 12, name: "Stir-fried Chopsuey", price: 160, category: "Vegetables", stock: 25, image: "https://picsum.photos/seed/veggies/400/400", inventoryLinkId: null, status: 'Available' },
  { id: 13, name: "Garlic Fried Rice", price: 45, category: "Rice", stock: 200, image: "https://picsum.photos/seed/rice/400/400", inventoryLinkId: null, status: 'Available' },
  { id: 14, name: "Caesar Salad", price: 175, category: "Salads", stock: 20, image: "https://picsum.photos/seed/salad/400/400", inventoryLinkId: null, status: 'Available' },
  { id: 15, name: "Crispy Calamares", price: 195, category: "Appetizers", stock: 30, image: "https://picsum.photos/seed/calamares/400/400", inventoryLinkId: null, status: 'Available' }
];

export const getProducts = () => {
  const storedProducts = localStorage.getItem('shop_products');
  let products = defaultProducts;
  
  if (storedProducts) {
    products = JSON.parse(storedProducts);
  } else {
    localStorage.setItem('shop_products', JSON.stringify(defaultProducts));
  }

  const inventory = getInventory();
  
  // Merge inventory levels into products
  return products.map((p: any) => {
    if (p.inventoryLinkId) {
      const invItem = inventory.find((i: any) => i.id === p.inventoryLinkId);
      return { ...p, stock: invItem ? invItem.quantity : 0 };
    }
    return p;
  });
};

export const saveProducts = (products: any[]) => {
  localStorage.setItem('shop_products', JSON.stringify(products));
};

export const addProduct = (newProduct) => {
  const currentProducts = getProducts();
  const productWithId = { ...newProduct, id: Date.now() }; 
  currentProducts.push(productWithId);
  saveProducts(currentProducts);
  return productWithId;
};

export const updateProduct = (updatedProduct: any) => {
  const currentProducts = getProducts();
  const updated = currentProducts.map((p: any) => p.id === updatedProduct.id ? updatedProduct : p);
  saveProducts(updated);
};

export const deleteProduct = (productId: number) => {
  const currentProducts = getProducts();
  const updated = currentProducts.filter((p: any) => p.id !== productId);
  saveProducts(updated);
};
