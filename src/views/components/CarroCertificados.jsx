import React, { useContext } from 'react';
import { ShoppingCart, FileText, Heart, Minus, Plus, X, CreditCard } from 'lucide-react';
import { CartContext } from '../../context/AppContexts';

export function CarroCertificados() {
  const { isCartOpen, setIsCartOpen, toggleCart, cartItems, updateQty, clearCart, totalItems } = useContext(CartContext);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isCartOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-blue-600" />
              <span className="text-slate-800" style={{ fontSize: "0.875rem", fontWeight: 600 }}>Carro de certificados</span>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X size={16} /></button>
          </div>
          <div className="px-4 py-3 max-h-64 overflow-y-auto space-y-2">
            {cartItems.length === 0 ? (
              <div className="py-8 text-center text-slate-400">Tu carro está vacío</div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg ${item.iconBg} ${item.iconColor} flex items-center justify-center`}>{item.icon || <FileText size={14} />}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 truncate" style={{ fontSize: "0.78rem", fontWeight: 500 }}>{item.name}</p>
                    <p className="text-slate-400" style={{ fontSize: "0.68rem" }}>{item.type || 'Gratis'} · {item.price === 0 ? 'Gratis' : `$${item.price}`}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg bg-white border flex items-center justify-center"><Minus size={11} /></button>
                    <span className="w-5 text-center text-slate-700" style={{ fontSize: "0.78rem", fontWeight: 600 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg bg-white border flex items-center justify-center"><Plus size={11} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          {cartItems.length > 0 && (
            <div className="px-4 pb-4">
              <button onClick={() => { clearCart(); setIsCartOpen(false); alert("Trámites confirmados con éxito"); }} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-xl text-sm font-medium">
                <CreditCard size={15} /> Confirmar
              </button>
            </div>
          )}
        </div>
      )}
      <button onClick={toggleCart} className="ml-auto flex items-center gap-2.5 pl-4 pr-3 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl transition-all">
        <ShoppingCart size={18} />
        <span className="text-sm font-medium">Mi carro</span>
        {totalItems > 0 && <span className="flex items-center justify-center w-5 h-5 bg-amber-400 text-blue-900 text-xs font-bold rounded-full">{totalItems}</span>}
      </button>
    </div>
  );
}
