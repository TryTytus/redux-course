// THE STORE (Vanilla implementation for teaching purposes)

export interface Product { id: number; name: string; price: number; }
export interface CartItem extends Product { quantity: number; addedAt?: number; }

export interface AppState {
  inventory: Product[];
  cart: {
    items: CartItem[];
  };
}

export type Action = 
  | { type: 'ADD_TO_CART'; payload: { productId: number } } // Needs updating to include timestamp
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; amount: number } }
  | { type: 'APPLY_DISCOUNT'; payload: { productId: number; newPrice: number } };

const initialState: AppState = {
  inventory: [
    { id: 1, name: 'Redux Fundamentals Book', price: 29.99 },
    { id: 2, name: 'React Context API Guide', price: 15.00 },
    { id: 3, name: 'Immutability Cheatsheet', price: 5.00 },
  ],
  cart: {
    items: [],
  }
};

// ❌ EXERCISE: Fix the Reducer ❌
// Identify the bugs below that violate Redux principles (Immutability, Pure Functions)
export const reducer = (state: AppState = initialState, action: Action): AppState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const product = state.inventory.find(p => p.id === action.payload.productId);
      if (!product) return state;

      const existingItem = state.cart.items.find(i => i.id === product.id);
      
       
      
      if (existingItem) {
        // BUG: Mutating nested object
        const updatedItems = state.cart.items.map(item => (item.id === product.id) ? ({...item, quantity: item.quantity + 1}) : ({...item}))
        existingItem.quantity += 1;

        return {
          inventory: state.inventory,
          cart: {
            items: updatedItems
          }
        }
      } else {
        // BUG: Mutating array via push()
        // BUG: Impure function (Date.now() inside reducer)

        return {
          inventory: state.inventory,
          cart: {
            items: [
              ...state.cart.items,
              {
                ...product, 
                quantity: 1, 
                addedAt: Date.now() 
              }
            ]
          }
        }
      }
      
      return state; // Retuning the exact same mutated state object
    }

    case 'UPDATE_QUANTITY': {
      // BUG: Nested object mutation
      const item = state.cart.items.find(i => i.id === action.payload.productId);
      if (item) {
        item.quantity += action.payload.amount;
        if (item.quantity <= 0) {
          // BUG: Array mutation
          const index = state.cart.items.indexOf(item);
          state.cart.items.splice(index, 1);
        }
      }
      return state;
    }

    case 'APPLY_DISCOUNT': {
      // Valid mutable or immutable update? You tell me! Wait, it's mutating. Fix it!
      const product = state.inventory.find(p => p.id === action.payload.productId);
      if (product) product.price = action.payload.newPrice;
      
      const cartItem = state.cart.items.find(c => c.id === action.payload.productId);
      if (cartItem) cartItem.price = action.payload.newPrice;
      
      return state;
    }

    default:
      return state;
  }
};

// --- VANILLA STORE IMPLEMENTATION ---
class Store {
  private state: AppState;
  private listeners: (() => void)[] = [];

  constructor(reducerFn: (s: AppState | undefined, a: Action) => AppState) {
    this.state = reducerFn(undefined, { type: '@@INIT' } as any);
  }

  // The ONE allowed way to update state
  dispatch = (action: Action) => {
    this.state = reducer(this.state, action);
    this.listeners.forEach(l => l());
  };

  getState = () => this.state;

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  };

  // ⚠️ SHAMEFUL BACKDOOR: Used only to demonstrate a bad practice in the exercise.
  // Never expose this in real life.
  _dangerousGetMutableState = () => this.state;
}

export const store = new Store(reducer);

// Action Creators
export const addToCart = (productId: number): Action => ({
  type: 'ADD_TO_CART',
  payload: { productId }
});

export const updateQuantity = (productId: number, amount: number): Action => ({
  type: 'UPDATE_QUANTITY',
  payload: { productId, amount }
});

export const applyDiscount = (productId: number, newPrice: number): Action => ({
  type: 'APPLY_DISCOUNT',
  payload: { productId, newPrice }
});
