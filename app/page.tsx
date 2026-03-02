"use client";

import { useState } from "react";
import Image from "next/image";
import { Bebas_Neue } from "next/font/google";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
});

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  prices: { simple: number; doble: number };
};

const menuItems: MenuItem[] = [
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
    name: "CLÁSICA",
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
  const [orderType, setOrderType] =
    useState<"delivery" | "takeaway" | null>(null);
  const [address, setAddress] = useState("");
  const [productNotes, setProductNotes] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");

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
        [key]: { ...prev[key], quantity: newQuantity },
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
${deliveryInstructions ? `Instrucciones: ${deliveryInstructions}` : ""}
${productNotes ? `Notas del producto: ${productNotes}` : ""}

${messageLines.join("\n")}

Subtotal: $${subtotal}
Envio: $${deliveryCost}
Total: $${total}`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className={`min-h-screen bg-[#e2bd7f] ${bebas.className}`}>
      {/* 🔴 CHECKER REAL INTERCALADO */}
      <div
        className="w-full h-16"
        style={{
          backgroundImage: `
            linear-gradient(45deg,#d63b2f 25%,transparent 25%),
            linear-gradient(-45deg,#d63b2f 25%,transparent 25%),
            linear-gradient(45deg,transparent 75%,#d63b2f 75%),
            linear-gradient(-45deg,transparent 75%,#d63b2f 75%)
          `,
          backgroundSize: "32px 32px",
          backgroundPosition: "0 0, 0 16px, 16px -16px, -16px 0px",
          backgroundColor: "#D8B47A",
        }}
      />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.png"
            alt="West Burger logo"
            width={260}
            height={260}
            priority
          />
        </div>

        {/* MENU CARD */}
        <div className="bg-[#f3d7a6] rounded-3xl p-6 shadow-md space-y-6">
          {menuItems.map((item) => (
            <div key={item.id} className="border-b border-[#e0b97f] pb-6">
              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-3xl text-[#5a0f0f] tracking-wide">
                    {item.name}
                  </h2>
                  <p className="text-base text-[#5a0f0f]/80 mt-1 normal-case font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="text-right text-[#c53030] font-bold text-lg">
                  <div>SIMPLE ${item.prices.simple}</div>
                  <div>DOBLE ${item.prices.doble}</div>
                </div>
              </div>

              {/* ✅ FIX MOBILE */}
              <div className="flex flex-wrap gap-5 mt-4">
                {(["simple", "doble"] as const).map((type) => {
                  const key = `${item.id}-${type}`;
                  return (
                    <div
                      key={type}
                      className="flex items-center gap-2 w-full sm:w-auto"
                    >
                      <button
                        onClick={() => removeItem(key)}
                        className="w-9 h-9 rounded-lg border-2 border-[#5a0f0f] bg-[#fff3df] text-[#5a0f0f] text-xl"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-bold text-xl text-[#5a0f0f]">
                        {cart[key]?.quantity || 0}
                      </span>
                      <button
                        onClick={() => addItem(item, type)}
                        className="w-9 h-9 rounded-lg bg-[#d63b2f] text-[#fff3df] text-xl"
                      >
                        +
                      </button>
                      <span className="text-sm text-[#5a0f0f] uppercase min-w-[60px] text-left">
                        {type}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* PEDIDO */}
        <div className="mt-6 bg-[#f3d7a6] rounded-3xl p-6 shadow-md">
          <h3 className="text-2xl text-[#5a0f0f] mb-4">TIPO DE PEDIDO</h3>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setOrderType("takeaway")}
              className={`flex-1 py-3 rounded-xl border-2 text-lg ${
                orderType === "takeaway"
                  ? "bg-[#d63b2f] text-[#fff3df]"
                  : "text-[#5a0f0f] border-[#5a0f0f]"
              }`}
            >
              TAKE AWAY
            </button>

            <button
              onClick={() => setOrderType("delivery")}
              className={`flex-1 py-3 rounded-xl border-2 text-lg ${
                orderType === "delivery"
                  ? "bg-[#d63b2f] text-[#fff3df]"
                  : "text-[#5a0f0f] border-[#5a0f0f]"
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
              className="w-full border-2 border-[#5a0f0f] p-3 rounded-xl font-sans bg-[#fff3df] text-[#5a0f0f] placeholder:text-[#5a0f0f]/50"
            />
          )}

          {/* NOTAS */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-[#5a0f0f] text-sm mb-1">
                NOTAS SOBRE EL PRODUCTO (OPCIONAL)
              </p>
              <textarea
                value={productNotes}
                onChange={(e) => setProductNotes(e.target.value)}
                className="w-full border-2 border-[#5a0f0f] p-3 rounded-xl font-sans bg-[#fff3df] text-[#5a0f0f] placeholder:text-[#5a0f0f]/50"
                placeholder="Ej: sin papas..."
              />
            </div>

            <div>
              <p className="text-[#5a0f0f] text-sm mb-1">
                INSTRUCCIONES DE ENTREGA (OPCIONAL)
              </p>
              <textarea
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="w-full border-2 border-[#5a0f0f] p-3 rounded-xl font-sans bg-[#fff3df] text-[#5a0f0f] placeholder:text-[#5a0f0f]/50"
                placeholder="Ej: entre calles..."
              />
            </div>
          </div>

          {/* 👤 NOMBRE Y APELLIDO */}
          <div className="mb-6">
            <p className="text-[#5a0f0f] text-sm mb-1">
              NOMBRE Y APELLIDO
            </p>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              className="w-full border-2 border-[#5a0f0f] p-3 rounded-xl font-sans bg-[#fff3df] text-[#5a0f0f] placeholder:text-[#5a0f0f]/50"
            />
          </div>

          {/* 💰 RESUMEN EN VIVO */}
          <div className="mb-6 bg-[#fff3df] border-2 border-[#5a0f0f] rounded-xl p-4 space-y-1">
            <div className="flex justify-between text-[#5a0f0f] text-lg">
              <span>SUBTOTAL</span>
              <span>${subtotal}</span>
            </div>

            <div className="flex justify-between text-[#5a0f0f] text-lg">
              <span>ENVÍO</span>
              <span>${deliveryCost}</span>
            </div>

            <div className="flex justify-between text-[#5a0f0f] text-2xl font-bold border-t border-[#5a0f0f] pt-2 mt-2">
              <span>TOTAL</span>
              <span>${total}</span>
            </div>
          </div>

          <button
            onClick={handleOrder}
            className="w-full bg-[#d63b2f] text-[#fff3df] py-4 rounded-xl text-2xl shadow-md"
          >
            HACER EL PEDIDO
          </button>
        </div>
      </div>
    </div>
  );
}
