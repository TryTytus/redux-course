import React from 'react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { LessonLayout } from '../../components/LessonLayout';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import * as ex from './exerciseApp'; // ← YOUR exercise file

let nextUser = 1, nextProduct = 1;
const USER_NAMES    = ['Alice', 'Bob', 'Carol'];
const PRODUCT_NAMES = ['RTK Course', 'Redux Book', 'DevTools'];

function Demo() {
  const dispatch = useDispatch();
  // Safe selectors — work before AND after the migration
  const users    = useSelector((s: any) => s?.users?.list ?? s?.app?.users ?? []);
  const products = useSelector((s: any) => s?.products?.items ?? s?.app?.products ?? []);

  const stateShape = Object.keys(ex.store.getState()).join(', ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ padding: '0.5rem 0.9rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
        <span style={{ color: 'var(--text-3)' }}>State keys: </span>
        <span style={{ color: stateShape === 'app' ? 'var(--error)' : 'var(--success)', fontWeight: 700 }}>
          {'{ ' + stateShape + ' }'}
        </span>
        <span style={{ color: 'var(--text-3)', fontSize: '0.7rem', marginLeft: '0.5rem' }}>
          {stateShape === 'app' ? '← monolith (split this!)' : '← ✓ split correctly!'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', borderColor: 'rgba(0,216,255,0.4)', color: 'var(--secondary)' }}
          onClick={() => dispatch(ex.addUser({ id: nextUser++, name: USER_NAMES[nextUser % 3], role: 'user' }) as any)}>
          + Add User
        </button>
        <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem', borderColor: 'rgba(255,71,133,0.4)', color: 'var(--accent)' }}
          onClick={() => dispatch(ex.addProduct({ id: nextProduct++, title: PRODUCT_NAMES[nextProduct % 3], price: 29 }) as any)}>
          + Add Product
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div className="demo-card" style={{ borderColor: 'rgba(0,216,255,0.3)' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', color: 'var(--secondary)', fontFamily: 'var(--font-mono)' }}>state.users (after split)</p>
          {users.map((u: any) => <div key={u.id} style={{ fontSize: '0.8rem', color: 'var(--text-2)', padding: '0.1rem 0' }}>#{u.id} {u.name}</div>)}
          {users.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', margin: 0 }}>empty</p>}
        </div>
        <div className="demo-card" style={{ borderColor: 'rgba(255,71,133,0.3)' }}>
          <p style={{ margin: '0 0 0.5rem', fontSize: '0.72rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>state.products (after split)</p>
          {products.map((p: any) => <div key={p.id} style={{ fontSize: '0.8rem', color: 'var(--text-2)', padding: '0.1rem 0' }}>#{p.id} {p.title}</div>)}
          {products.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', margin: 0 }}>empty</p>}
        </div>
      </div>
      <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-3)' }}>
        💡 Watch the <strong>State keys</strong> line. Before split: <code>{'{ app }'}</code>. After split: <code>{'{ users, products, ui }'}</code>.
      </p>
    </div>
  );
}

export function Lesson({ onComplete }: { onComplete?: () => void }) {
  return (
    <LessonLayout
      lessonNumber={9} title="combineReducers" badge="Utility"
      whatIsIt={<><code>combineReducers({'{ users, products }'})</code> merges multiple reducers into one root reducer. Each reducer owns its own <strong>branch</strong> of state. When you pass an object to <code>configureStore</code>'s <code>reducer:</code> key, RTK calls <code>combineReducers</code> for you automatically.</>}
      whenToUse={[
        'When state grows and needs feature-based separation',
        'When multiple developers each own a slice of state',
        'Explicitly when integrating RTK into an existing non-slice setup',
        'Note: configureStore({ reducer: { a, b } }) calls combineReducers automatically!',
      ]}
      howItWorks={`// State keys come from the reducer keys you provide:
const store = configureStore({
  reducer: {
    users:    usersSlice.reducer,    // → state.users.*
    products: productsSlice.reducer, // → state.products.*
    // RTK internally calls combineReducers({ users, products })
  }
});

// Explicit combineReducers (same result):
const rootReducer = combineReducers({
  users: usersSlice.reducer,
  products: productsSlice.reducer,
});`}
      liveDemo={
        <Provider store={ex.store}>
          <ErrorBoundary>
            <Demo />
          </ErrorBoundary>
        </Provider>
      }
      exerciseTitle="Split a Monolith Into Two Slices"
      exerciseContext={<>The state keys box above shows <code>app</code> — everything is in one giant slice. Watch it change to <code>users, products, ui</code> after your migration. The Add buttons will still work because the demo uses flexible selectors.</>}
      exerciseSteps={[
        { text: 'Open exerciseApp.ts — read the monolith appSlice', hint: 'src/lessons/09-combine-reducers/exerciseApp.ts' },
        { text: 'Create usersSlice: { list: User[], loading: boolean } with addUser reducer', hint: 'Copy user-related state and reducers from appSlice' },
        { text: 'Create productsSlice: { items: Product[], filter: string | null } with addProduct', hint: 'Copy product-related state and reducers from appSlice' },
        { text: 'Update configureStore: { reducer: { users: usersSlice.reducer, products: productsSlice.reducer } }', hint: 'State keys match the reducer keys!' },
        { text: 'Export addUser and addProduct from their new slices', hint: 'The demo imports these from exerciseApp.ts' },
      ]}
      exerciseFile="src/lessons/09-combine-reducers/exerciseApp.ts"
      solution={`const usersSlice    = createSlice({ name: 'users',    initialState: { list: [] as User[],    loading: false }, reducers: { addUser:    (s, a) => { s.list.push(a.payload);  } } });
const productsSlice = createSlice({ name: 'products', initialState: { items: [] as Product[], filter: null  }, reducers: { addProduct: (s, a) => { s.items.push(a.payload); } } });

export const { addUser }    = usersSlice.actions;
export const { addProduct } = productsSlice.actions;

// configureStore automatically calls combineReducers:
export const store = configureStore({
  reducer: {
    users:    usersSlice.reducer,    // state.users.*
    products: productsSlice.reducer, // state.products.*
  }
});`}
      onComplete={onComplete}
    />
  );
}
