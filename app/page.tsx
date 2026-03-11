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
  const [customerName, setCustomerName] = useState("");

  const [comboType, setComboType] = useState<"simple" | "doble" | null>(null);

  const COMBO_EXTRA = 3000;

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

  const addComboBurger = (item: MenuItem) => {
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
    if (orderType === "delivery" && address.trim() === "") {
      alert("Por favor ingresá tu dirección.");
      return;
    }

    const phoneNumber = "5492346350776";

    const messageLines = Object.values(cart).map(
      (item) => `${item.quantity}x ${item.name}`
    );

    const message = `Hola! Quiero hacer el siguiente pedido:

Nombre y apellido: ${customerName || "-"}

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

        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="West Burger logo"
            width={260}
            height={260}
            priority
          />
        </div>

        <h1 className="text-center text-4xl text-[#5a0f0f] mb-6 tracking-wide">
          HACÉ TU PEDIDO
        </h1>

        {/* COMBOS */}

        <div className="grid grid-cols-2 gap-4 mb-8">

          <div
            onClick={() => setComboType("simple")}
            className="bg-[#f3d7a6] rounded-3xl overflow-hidden shadow-md cursor-pointer"
          >
            <Image
              src="/simple.jpg"
              alt="combo simple"
              width={400}
              height={300}
              className="w-full h-[200px] object-cover"
            />

            <div className="p-3 text-center text-[#5a0f0f] text-2xl">
              COMBO SIMPLE
            </div>
          </div>

          <div
            onClick={() => setComboType("doble")}
            className="bg-[#f3d7a6] rounded-3xl overflow-hidden shadow-md cursor-pointer"
          >
            <Image
              src="/doble.jpg"
              alt="combo doble"
              width={400}
              height={300}
              className="w-full h-[200px] object-cover"
            />

            <div className="p-3 text-center text-[#5a0f0f] text-2xl">
              COMBO DOBLE
            </div>
          </div>

        </div>

        {comboType && (
          <div className="bg-[#f3d7a6] rounded-3xl p-6 shadow-md mb-6">
            <h2 className="text-3xl text-[#5a0f0f] mb-4 text-center">
              ELEGÍ TU BURGER
            </h2>

            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => addComboBurger(item)}
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

      </div>

    </div>
  );
}