export interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    available: boolean;
    crusine: string;
    weight: string;
    calories: string;
    glbFileUrl: string;
    usdzFileUrl: string;
    restaurantName: string | null;
  }
  
  
export interface Category {
    _id: string;
    name: string;
    imageUrl?: string;
  }
  
  
export interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    customerNumber: string;
    orderDetails: string;
    menuItems: { menuItemId: string; quantity: number }[];
    totalPrice: number;
    status: string;
    orderDate: Date;
    paymentStatus: string;
    paymentMethod: string;
    location: {
      lat: number;
      lng: number;
    };
  }

export type RootStackParamList = {
    Splash: undefined;
    Home: undefined;
    Main:undefined;
    CategoryItems: { crusine: string };
    FavoritesScreen: undefined;
    ProductDetail: {
      productId:string;
    }
    CheckoutScreen: undefined;
    ThankYou:undefined;
    Search:undefined;
  };