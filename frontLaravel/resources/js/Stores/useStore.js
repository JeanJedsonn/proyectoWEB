import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set) => ({
            theme: 'dark',
            items: [],
            loading: false,

            setTheme: (theme) => set({ theme }),
            setItems: (items) => set({ items }),
            setLoading: (status) => set({ loading: status }),

            // Estado para el carrito si es necesario
            cart: [],
            addToCart: (item) => set((state) => ({ 
                cart: [...state.cart, item] 
            })),
            clearCart: () => set({ cart: [] }),
        }),
        { name: 'app-storage' }
    )
);
