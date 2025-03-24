import React, { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "@/Base/base";
import { Category, MenuItem, Order } from "@/types/types";

interface ApiContextType {
  menu: MenuItem[];
  categories: Category[];
  orders: Order[];
  loading: boolean;
  fetchMenu: () => void;
  fetchCategories: () => void;
  fetchOrders: () => void;
  placeOrder: (order: Order) => Promise<void>;
}


const ApiContext = createContext<ApiContextType | undefined>(undefined);


export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/menu`);
      const data = await response.json();
      setMenu(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/category`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (order: Order) => {
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Failed to place order");
      }

      fetchOrders();
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchCategories();
    fetchOrders();
  }, []);

  return (
    <ApiContext.Provider
      value={{ menu, categories, orders, loading, fetchMenu, fetchCategories, fetchOrders, placeOrder }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
