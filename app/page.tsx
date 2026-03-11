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
  const [comboType, setComboType] = useState<"simple" | "doble" | null>(null);

  const [orderType, setOrderType] =
    useState<"delivery" | "takeaway" | null>(null);
  const [address, setAddress] = useState("");
  const [productNotes, setProductNotes] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [customerName, setCustomerName] = useState("");

  const COMBO_EXTRA = 3000;

  const addItem = (item: MenuItem, type: "simple" | "doble") => {
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

  const addCombo = (item: MenuItem) => {
    if (!comboType) return;

    const key = `combo-${item.id}-${comboType}`;

    setCart((prev) => ({
      ...prev,
      [key]: {
        id: key,
        name: `COMBO ${comboType.toUpperCase()} - ${item.name}`,
        price: item.prices[comboType] + COMBO_EXTRA,
        quantity: (prev[key]?.quantity || 0) + 1,
      },
    }));

    setComboType(null);
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

    const phoneNumber = "5492346350776";

    const messageLines = Object.values(cart).map(
      (item) => `${item.quantity}x ${item.name}`
    );

    const message = `Hola! Quiero hacer el siguiente pedido:

Nombre: ${customerName}

${messageLines.join("\n")}

Total: $${total}`;

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className={`min-h-screen bg-[#e2bd7f] ${bebas.className}`}>
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

        {/* COMBOS */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">

          <div
            onClick={() => setComboType("simple")}
            className="bg-[#f3d7a6] rounded-3xl shadow-md overflow-hidden cursor-pointer"
          >
            <Image
              src="/combo-simple.jpg"
              alt="Combo Simple"
              width={500}
              height={400}
              className="w-full h-[240px] object-cover"
            />

            <div className="p-4 text-center">
              <h3 className="text-3xl text-[#5a0f0f]">
                COMBO SIMPLE
              </h3>

              <p className="font-sans text-sm text-[#5a0f0f]/80">
                Burger simple + papas + bebida
              </p>
            </div>
          </div>

          <div
            onClick={() => setComboType("doble")}
            className="bg-[#f3d7a6] rounded-3xl shadow-md overflow-hidden cursor-pointer"
          >
            <Image
              src="/combo-doble.jpg"
              alt="Combo Doble"
              width={500}
              height={400}
              className="w-full h-[240px] object-cover"
            />

            <div className="p-4 text-center">
              <h3 className="text-3xl text-[#5a0f0f]">
                COMBO DOBLE
              </h3>

              <p className="font-sans text-sm text-[#5a0f0f]/80">
                Burger doble + papas + bebida
              </p>
            </div>
          </div>

        </div>

        {/* SELECTOR BURGER PARA COMBO */}
        {comboType && (
          <div className="bg-[#f3d7a6] rounded-3xl p-6 shadow-md mb-8">
            <h2 className="text-3xl text-[#5a0f0f] mb-4 text-center">
              ELEGÍ TU BURGER
            </h2>

            <div className="space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addCombo(item)}
                  className="w-full border-2 border-[#5a0f0f] rounded-xl py-3 text-[#5a0f0f] text-lg"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MENU ORIGINAL */}
        <div className="bg-[#f3d7a6] rounded-3xl p-6 shadow-md space-y-6">
          {menuItems.map((item) => (
            <div key={item.id} className="border-b border-[#e0b97f] pb-6">

              <div className="flex justify-between gap-4">
                <div>
                  <h2 className="text-3xl text-[#5a0f0f]">
                    {item.name}
                  </h2>

                  <p className="text-base text-[#5a0f0f]/80 mt-1 font-sans">
                    {item.description}
                  </p>
                </div>

                <div className="text-right text-[#c53030] font-bold text-lg">
                  <div>SIMPLE ${item.prices.simple}</div>
                  <div>DOBLE ${item.prices.doble}</div>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                {(["simple", "doble"] as const).map((type) => {
                  const key = `${item.id}-${type}`;

                  return (
                    <div key={type} className="flex items-center gap-2">

                      <button
                        onClick={() => removeItem(key)}
                        className="w-9 h-9 rounded-lg border-2 border-[#5a0f0f]"
                      >
                        −
                      </button>

                      <span className="w-8 text-center font-bold text-xl text-[#5a0f0f]">
                        {cart[key]?.quantity || 0}
                      </span>

                      <button
                        onClick={() => addItem(item, type)}
                        className="w-9 h-9 rounded-lg bg-[#d63b2f] text-white"
                      >
                        +
                      </button>

                      <span className="text-sm text-[#5a0f0f] uppercase">
                        {type}
                      </span>

                    </div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-6 bg-[#f3d7a6] rounded-3xl p-6 shadow-md">

          <div className="flex justify-between text-[#5a0f0f] text-2xl font-bold">
            <span>TOTAL</span>
            <span>${total}</span>
          </div>

          <button
            onClick={handleOrder}
            className="w-full mt-4 bg-[#d63b2f] text-[#fff3df] py-4 rounded-xl text-2xl"
          >
            HACER EL PEDIDO
          </button>

        </div>

      </div>
    </div>
  );
}