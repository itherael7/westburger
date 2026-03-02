"use client";

import { useState } from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const menuItems = [
  {
    id: 1,
    name: "BURGER CHEESE",
    description: "Carne smasheada, 4 fetas de queso cheddar.",
    prices: { simple: 10000, doble: 12500 },
  },
  {
    id: 3,
    name: "PROVO-BACON",
    description:
      "Carne smasheada, queso provolone, bacon ahumado, cebolla caramelizada y salsa barbacoa de la casa.",
    prices: { simple: 10500, doble: 13000 },
  },
  {
    id: 4,
    name: "CLASICA",
    description:
      "Carne smasheada, cheddar, lechuga, pepino encurtido, cebolla y salsa clásica.",
    prices: { simple: 10500, doble: 13000 },
  },
  {
    id: 5,
    name: "AMERICANA",
    description:
      "Carne smasheada, cheddar, lechuga, tomate, cebolla y salsa west.",
    prices: { simple: 10500, doble: 13000 },
  },
  {
    id: 6,
    name: "CUARTO",
    description:
      "Carne smasheada, cheddar, cebolla, mostaza y ketchup.",
    prices: { simple: 10500, doble: 13000 },
  },
];

export default function Page() {
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [orderType, setOrderType] = useState<"delivery" | "takeaway" | null>(null);
  const [address, setAddress] = useState("");

  const addItem = (item: any, type: "simple" | "doble") => {
    const key = `${item.id}-${type}`;

    setCart((prev) => ({
      ...prev,
      [key]: {
        id: key,
        name: `${item.name} (${type.toUpperCase()})`,
        price: item.prices[type],
        quantity: (prev[key]?.quantity || 0) + 1,
      },
    }));
  };

  const removeItem = (key: string) => {
    if (!cart[key]) return;

    const newQuantity = cart[key].quantity - 1;

    if (newQuantity <= 0) {
      const updated = { ...cart };
      delete updated[key];
      setCart(updated);
    } else {
      setCart((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          quantity: newQuantity,
        },
      }));
    }
  };

  const subtotal = Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const deliveryCost = orderType === "delivery" ? 2500 : 0;
  const total = subtotal + deliveryCost;

  const handleOrder = () => {
    if (Object.keys(cart).length === 0 || !orderType) return;

    if (orderType === "delivery" && address.trim() === "") {
      alert("Por favor ingresá tu dirección.");
      return;
    }

    const phoneNumber = "5492346350776";

    const messageLines = Object.values(cart).map(
      (item) => `${item.quantity}x ${item.name}`
    );

    const message = `Hola! Quiero hacer el siguiente pedido:

Tipo: ${orderType.toUpperCase()}
${orderType === "delivery" ? `Dirección: ${address}` : ""}

${messageLines.join("\n")}

Subtotal: $${subtotal}
Envio: $${deliveryCost}
Total: $${total}`;

    const encodedMessage = encodeURIComponent(message);

    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f3e3cf] font-black">

      {/* Patrón cuadriculado arriba */}
      <div className="h-16 w-full bg-[#e53935] bg-[linear-gradient(45deg,#e53935_25%,transparent_25%,transparent_75%,#e53935_75%),linear-gradient(45deg,#e53935_25%,transparent_25%,transparent_75%,#e53935_75%)] bg-[size:40px_40px] bg-[position:0_0,20px_20px] opacity-40"></div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="text-center mb-8">
          <h1 className="text-4xl text-black">MENÚ</h1>
          <div className="inline-block bg-[#e53935] px-6 py-2 rounded-lg mt-2 shadow-md">
            <span className="text-3xl text-black">WEST BURGER</span>
          </div>
        </div>

        <div className="space-y-6">
          {menuItems.map((item) => (
            <div key={item.id} className="border-b border-[#d9bfa3] pb-4">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-xl text-black">{item.name}</h2>
                  <p className="text-sm text-black mt-1">
                    {item.description}
                  </p>
                  {item.extra && (
                    <p className="text-sm mt-1 text-black">{item.extra}</p>
                  )}
                </div>

                <div className="text-right text-[#e53935] text-sm">
                  <div>Simple ${item.prices.simple}</div>
                  <div>Doble ${item.prices.doble}</div>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                {(["simple", "doble"] as const).map((type) => {
                  const key = `${item.id}-${type}`;
                  return (
                    <div key={type} className="flex items-center gap-2">
                      <button
                        onClick={() => removeItem(key)}
                        className="bg-white border px-3 rounded text-black"
                      >
                        -
                      </button>
                      <span className="text-black">
                        {cart[key]?.quantity || 0}
                      </span>
                      <button
                        onClick={() => addItem(item, type)}
                        className="bg-[#e53935] px-3 rounded text-black"
                      >
                        +
                      </button>
                      <span className="text-xs uppercase text-black">
                        {type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white p-5 rounded-lg shadow-md">

          <h3 className="text-lg mb-3 text-black">TIPO DE PEDIDO</h3>

          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setOrderType("takeaway")}
              className={`flex-1 py-2 rounded border text-black ${
                orderType === "takeaway"
                  ? "bg-[#e53935]"
                  : "bg-white"
              }`}
            >
              TAKE AWAY
            </button>

            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-2 rounded border text-black ${
                orderType === "delivery"
                  ? "bg-[#e53935]"
                  : "bg-white"
              }`}
            >
              DELIVERY (+$2500)
            </button>
          </div>

          {orderType === "delivery" && (
            <input
              type="text"
              placeholder="Ingresá tu dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-2 rounded mb-4 text-black"
            />
          )}

          <h3 className="text-lg mb-3 text-black">TU PEDIDO</h3>

          {Object.keys(cart).length === 0 ? (
            <p className="text-sm text-gray-500">No agregaste productos.</p>
          ) : (
            <div className="space-y-1 text-sm text-black">
              {Object.values(cart).map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between mt-3 text-sm text-black">
            <span>Subtotal</span>
            <span>${subtotal}</span>
          </div>

          {orderType === "delivery" && (
            <div className="flex justify-between text-sm text-black">
              <span>Envío</span>
              <span>$2500</span>
            </div>
          )}

          <div className="flex justify-between mt-2 border-t pt-2 text-black">
            <span>TOTAL</span>
            <span>${total}</span>
          </div>

          <button
            onClick={handleOrder}
            className="w-full mt-4 bg-[#e53935] py-3 rounded-lg text-black shadow-md"
          >
            HACER EL PEDIDO
          </button>

        </div>
      </div>
    </div>
  );
}
