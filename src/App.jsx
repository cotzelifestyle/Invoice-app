import { useMemo, useState } from "react";

import CotzeLogo from "./CotzeLogo.jsx";

import { numberToIndianWords } from "./numberToWords.js";



const COMPANY = {

  name: "COTZE LIFESTYLE",

  addressLine1: "FF-138, Arth Business Center, Opp. Torent Power, S.P. Ring",

  addressLine2: "Road, Nikol, Ahmedabad, Gujrat. 382350",

  phone: "9998077144",

  email: "cotzelifestyle@gmail.com",

  gstin: "24AAVFC5963F1Z3",

  state: "24-Gujarat",

};



const TERMS = `If you are dissatisfied with any product from the company, you must return or exchange it within a maximum of 2 Days.

50% advance payment will be required after placing the order and 50% will be required after the parcel is delivered to you.

If you do not complete the payment, the company will take legal action as per government rules.

If you agree to the company's terms and conditions, then you can collect this bill.`;



const EMPTY_ITEM = () => ({

  id: crypto.randomUUID(),

  name: "",

  hsn: "",

  qty: "",

  price: "",

});



const SAMPLE = {

  invoiceNo: "CL/6",

  date: "2026-08-13",

  placeOfSupply: "24-Gujarat",

  customerName: "Aumento InfoWay",

  customerAddress:

    "227 ISCON EMPORIO B/S. STAR INDIA BAZAR, NR.\nJODHPUR CROSS ROAD SATELLITE\nAhmedabad, Gujarat-380015\nIndia",

  customerContact: "9328035608",

  customerGstin: "24AAPCA0400N1ZU",

  customerState: "24-Gujarat",

  received: "",
  cgstRate: "2.5",
  sgstRate: "2.5",

  items: [

    {

      id: crypto.randomUUID(),

      name: "Aumento Polo T-shirt Blue",

      hsn: "61099090",

      qty: "35",

      price: "275.00",

    },

  ],

};





function toNumber(value) {

const n = parseFloat(String(value).replace(/,/g, ""));

  return Number.isFinite(n) ? n : 0;

}



function round2(value) {

  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;

}



function formatMoney(value) {

  return round2(value).toLocaleString("en-IN", {

    minimumFractionDigits: 2,

    maximumFractionDigits: 2,

  });

}



function formatDateDisplay(iso) {

  if (!iso) return "";

const [y, m, d] = iso.split("-");

  if (!y || !m || !d) return iso;

  return `${d}-${m}-${y}`;

}



export default function App() {

const [invoice, setInvoice] = useState(SAMPLE);



const calculations = useMemo(() => {

const lineItems = invoice.items.map((item) => {
      const qty = toNumber(item.qty);
      const price = toNumber(item.price);
      const amount = round2(qty * price);
      return { ...item, qty, price, amount };
    });

    const qtyTotal = lineItems.reduce((sum, item) => sum + item.qty, 0);
    const subTotal = round2(lineItems.reduce((sum, item) => sum + item.amount, 0));
    // GST is assessed once on the invoice subtotal, not per item.
    const cgst = round2(subTotal * Math.max(0, toNumber(invoice.cgstRate)) / 100);
    const sgst = round2(subTotal * Math.max(0, toNumber(invoice.sgstRate)) / 100);
    const total = round2(subTotal + cgst + sgst);

    const received = invoice.received === "" ? total : round2(toNumber(invoice.received));

const balance = round2(total - received);



    return {

      lineItems,

      qtyTotal,

      subTotal,

  
      sgst,

      cgst,

      total,

      received,

      balance,

    };

  }, [invoice]);



function updateField(field, value) {

    setInvoice((prev) => ({ ...prev, [field]: value }));

  }



function updateItem(id, field, value) {

    setInvoice((prev) => ({

      ...prev,

      items: prev.items.map((item) =>

        item.id === id ? { ...item, [field]: value } : item

      ),

    }));

  }



function addItem() {

    setInvoice((prev) => ({

      ...prev,

      items: [...prev.items, EMPTY_ITEM()],

    }));

  }



function removeItem(id) {

    setInvoice((prev) => ({

      ...prev,

      items:

        prev.items.length === 1

          ? prev.items

          : prev.items.filter((item) => item.id !== id),

    }));

  }



function resetSample() {

    setInvoice({

      ...SAMPLE,

      items: SAMPLE.items.map((item) => ({ ...item, id: crypto.randomUUID() })),

    });

  }



function clearAll() {

    setInvoice({

      invoiceNo: "",

      date: new Date().toISOString().slice(0, 10),

      placeOfSupply: "24-Gujarat",

      customerName: "",

      customerAddress: "",

      customerContact: "",

      customerGstin: "",

      customerState: "24-Gujarat",

      received: "",
      cgstRate: "2.5",
      sgstRate: "2.5",

      items: [EMPTY_ITEM()],

    });

  }



  return (

    <div className="app">

      <header className="app-header no-print">

        <div>

          <p className="eyebrow">Tax Invoice Generator</p>

          <h1>Cotze Lifestyle Billing</h1>

        </div>

        <div className="header-actions">

          <button type="button" className="ghost" onClick={resetSample}>

            Load sample

          </button>

          <button type="button" className="ghost" onClick={clearAll}>

            New invoice

          </button>

          <button type="button" className="primary" onClick={() => window.print()}>

            Print / Save PDF

          </button>

        </div>

      </header>



      <main className="layout">

        <section className="editor no-print">

          <h2>Invoice details</h2>

          <div className="grid two">

            <label>

              Invoice number

              <input

                value={invoice.invoiceNo}

                onChange={(e) => updateField("invoiceNo", e.target.value)}

              />

            </label>

            <label>

              Date

              <input

                type="date"

                value={invoice.date}

                onChange={(e) => updateField("date", e.target.value)}

              />

            </label>

          </div>

          <label>

            Place of supply

            <input

              value={invoice.placeOfSupply}

              onChange={(e) => updateField("placeOfSupply", e.target.value)}

            />

          </label>



          <h2>Customer</h2>

          <label>

            Customer name

            <input

              value={invoice.customerName}

              onChange={(e) => updateField("customerName", e.target.value)}

            />

          </label>

          <label>

            Address

            <textarea

              rows={4}

              value={invoice.customerAddress}

              onChange={(e) => updateField("customerAddress", e.target.value)}

            />

          </label>

          <label>

            Contact number

            <input

              value={invoice.customerContact}

              onChange={(e) => updateField("customerContact", e.target.value)}

            />

          </label>

          <label>

            GSTIN

            <input

              value={invoice.customerGstin}

              onChange={(e) => updateField("customerGstin", e.target.value)}

            />

          </label>

          <label>

            State

            <input

              value={invoice.customerState}

              onChange={(e) => updateField("customerState", e.target.value)}

            />

          </label>



          <div className="items-heading">

            <h2>Items</h2>

            <button type="button" className="ghost small" onClick={addItem}>

              \+ Add item

            </button>

          </div>



          <div className="item-list">

            {invoice.items.map((item, index) => {

const amount = round2(toNumber(item.qty) * toNumber(item.price));

              return (

                <article className="item-card" key={item.id}>

                  <div className="item-card-top">

                    <span>Item {index + 1}</span>

                    <button

                      type="button"

                      className="link-danger"

                      onClick={() => removeItem(item.id)}

                      disabled={invoice.items.length === 1}

                    >

                      Remove

                    </button>

                  </div>

                  <label>

                    Item name

                    <input

                      value={item.name}

                      onChange={(e) => updateItem(item.id, "name", e.target.value)}

                    />

                  </label>

                  <div className="grid two">

                    <label>

                      HSN/SAC

                      <input

                        value={item.hsn}

                        onChange={(e) => updateItem(item.id, "hsn", e.target.value)}

                      />

                    </label>

                    <label>

                      Quantity

                      <input

                        inputMode="decimal"

                        value={item.qty}

                        onChange={(e) => updateItem(item.id, "qty", e.target.value)}

                      />

                    </label>

                  </div>

                  <div className="grid two">
                    <label>
                      Price / unit
                      <input
                        inputMode="decimal"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, "price", e.target.value)}
                      />
                    </label>
                    <label>
                      Amount (before tax)
                      <input readOnly value={formatMoney(amount)} />
                    </label>
                  </div>
                </article>

              );

            })}

          </div>



          <h2>Invoice taxes</h2>
          <div className="grid two">
            <label>
              CGST (%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={invoice.cgstRate ?? ""}
                onChange={(e) => updateField("cgstRate", e.target.value)}
              />
            </label>
            <label>
              SGST (%)
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={invoice.sgstRate ?? ""}
                onChange={(e) => updateField("sgstRate", e.target.value)}
              />
            </label>
          </div>

          <label>

            Received

            <input

              inputMode="decimal"

              placeholder={formatMoney(calculations.total)}

              value={invoice.received}

              onChange={(e) => updateField("received", e.target.value)}

            />

          </label>



          <div className="summary-box">

            <p>

              Sub total <strong>₹ {formatMoney(calculations.subTotal)}</strong>

            </p>

            <p>

              SGST ({invoice.sgstRate || 0}%) <strong>₹ {formatMoney(calculations.sgst)}</strong>

            </p>

            <p>

              CGST ({invoice.cgstRate || 0}%) <strong>₹ {formatMoney(calculations.cgst)}</strong>

            </p>

            <p className="grand">

              Total <strong>₹ {formatMoney(calculations.total)}</strong>

            </p>

            <p>

              Balance <strong>₹ {formatMoney(calculations.balance)}</strong>

            </p>

          </div>

        </section>



        <section className="preview-wrap">

          <div className="invoice-sheet">

            <header className="sheet-header">

              <div className="company-block">

                <h1>{COMPANY.name}</h1>

                <p>

                  {COMPANY.addressLine1}

                  <br />

                  {COMPANY.addressLine2}

                </p>

                <p>Phone no. : {COMPANY.phone}</p>

                <p>Email : {COMPANY.email}</p>

                <p>GSTIN : {COMPANY.gstin}</p>

                <p>State: {COMPANY.state}</p>

              </div>

              <CotzeLogo />

            </header>



            <h2 className="tax-title">Tax Invoice</h2>



            <div className="bill-meta">

              <div className="bill-to">

                <h3>Bill To</h3>

                <p className="party-name">{invoice.customerName}</p>

                <p className="party-address">{invoice.customerAddress}</p>

                {invoice.customerContact ? (

                  <p>Contact No. : {invoice.customerContact}</p>

                ) : null}

                {invoice.customerGstin ? <p>GSTIN : {invoice.customerGstin}</p> : null}

                {invoice.customerState ? <p>State: {invoice.customerState}</p> : null}

              </div>

              <div className="invoice-details">

                <h3>Invoice Details</h3>

                <p>Invoice No. : {invoice.invoiceNo}</p>

                <p>Date : {formatDateDisplay(invoice.date)}</p>

                <p>Place of supply: {invoice.placeOfSupply}</p>

              </div>

            </div>



            <table className="items">

              <thead>

                <tr>

                  <th className="col-no">#</th>

                  <th className="col-item">Item name</th>

                  <th className="col-hsn">HSN/ SAC</th>

                  <th className="col-qty">Quantity</th>

                  <th className="col-price">Price/ Unit</th>


                  <th className="col-amt">Amount</th>

                </tr>

              </thead>

              <tbody>

                {calculations.lineItems.map((item, index) => (

                  <tr key={item.id}>

                    <td className="col-no">{index + 1}</td>

                    <td className="col-item">

                      <strong>{item.name}</strong>

                    </td>

                    <td className="col-hsn">{item.hsn}</td>

                    <td className="col-qty">{item.qty || ""}</td>

                    <td className="col-price">₹ {formatMoney(item.price)}</td>

                    <td className="col-amt">₹ {formatMoney(item.amount)}</td>

                  </tr>

                ))}

              </tbody>

              <tfoot>

                <tr>

                  <td className="col-no" />

                  <td className="col-item">

                    <strong>Total</strong>

                  </td>

                  <td />

                  <td className="col-qty">

                    <strong>{calculations.qtyTotal || ""}</strong>

                  </td>

                  <td />

                  <td className="col-amt">

                    <strong>₹ {formatMoney(calculations.subTotal)}</strong>

                  </td>

                </tr>

              </tfoot>

            </table>



            <div className="sheet-footer">

              <div className="left-notes">

                <h3>Invoice Amount In Words</h3>

                <p>{numberToIndianWords(calculations.total)}</p>

                <h3>Terms and Conditions</h3>

                <p className="terms">{TERMS}</p>

              </div>

              <div className="right-totals">

                <div className="totals-row">

                  <span>Sub Total</span>

                  <span>₹ {formatMoney(calculations.subTotal)}</span>

                </div>

                <div className="totals-row">

                  <span>SGST @ {invoice.sgstRate || 0}%</span>

                  <span>₹ {formatMoney(calculations.sgst)}</span>

                </div>

                <div className="totals-row">

                  <span>CGST @ {invoice.cgstRate || 0}%</span>

                  <span>₹ {formatMoney(calculations.cgst)}</span>

                </div>

                <div className="totals-row total-bar">

                  <span>Total</span>

                  <span>₹ {formatMoney(calculations.total)}</span>

                </div>

                <div className="totals-row">

                  <span>Received</span>

                  <span>₹ {formatMoney(calculations.received)}</span>

                </div>

                <div className="totals-row">

                  <span>Balance</span>

                  <span>₹ {formatMoney(calculations.balance)}</span>

                </div>

                <div className="sign-off">

                  <p>For :{COMPANY.name}</p>

                  <p className="signatory">Authorized Signatory</p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>

  );

}
