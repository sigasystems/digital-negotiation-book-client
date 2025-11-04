export const generateReceiptHTML = (orderData, formatPrice) => {
  return `
    <html>
      <head>
        <title>Payment Receipt - ${orderData.businessName}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            padding: 48px; 
            max-width: 900px; 
            margin: 0 auto;
            color: #1f2937;
            line-height: 1.6;
          }
          .header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 24px;
            margin-bottom: 32px;
          }
          .logo-area {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 16px;
          }
          h1 { 
            color: #111827; 
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 8px;
          }
          .subtitle {
            color: #6b7280;
            font-size: 14px;
          }
          .receipt-id {
            text-align: right;
          }
          .receipt-id-label {
            color: #6b7280;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .receipt-id-value {
            font-family: 'Courier New', monospace;
            color: #111827;
            font-size: 14px;
            font-weight: 600;
            margin-top: 4px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            background: #f9fafb;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 32px;
            border: 1px solid #e5e7eb;
          }
          .info-section h3 {
            color: #374151;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            font-weight: 600;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .label { 
            color: #6b7280; 
            font-size: 14px;
          }
          .value { 
            color: #111827; 
            font-weight: 500; 
            font-size: 14px;
            text-align: right;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          }
          .details-table th {
            background: #f3f4f6;
            color: #374151;
            font-size: 13px;
            font-weight: 600;
            text-align: left;
            padding: 14px 16px;
            border-bottom: 2px solid #e5e7eb;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .details-table td {
            padding: 16px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 14px;
            color: #1f2937;
          }
          .badge {
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
          }
          .totals-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            padding: 24px;
            border-radius: 12px;
            margin-top: 32px;
            border: 2px solid #bae6fd;
          }
          .subtotal-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            color: #374151;
            font-size: 14px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding-top: 16px;
            margin-top: 16px;
            border-top: 2px solid #93c5fd;
            font-size: 24px;
            font-weight: 700;
            color: #111827;
          }
          .footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
          }
          .footer-text {
            color: #6b7280;
            font-size: 13px;
            margin-bottom: 8px;
          }
          .footer-contact {
            color: #2563eb;
            font-size: 13px;
            font-weight: 600;
          }
          .print-button {
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-bottom: 24px;
          }
          .print-button:hover {
            background: #1d4ed8;
          }
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #dcfce7;
            color: #166534;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }
          .status-dot {
            width: 6px;
            height: 6px;
            background: #16a34a;
            border-radius: 50%;
          }
        </style>
      </head>
      <body>
        <button class="print-button no-print" onclick="window.print()">🖨️ Print Receipt</button>
        
        <div class="header">
          <div class="logo-area">
            <div>
              <h1>Payment Receipt</h1>
              <p class="subtitle">Official Transaction Record</p>
            </div>
            <div class="receipt-id">
              <div class="receipt-id-label">Receipt Number</div>
              <div class="receipt-id-value">#${orderData.transactionId || 'N/A'}</div>
            </div>
          </div>
          <div style="margin-top: 20px;">
            <span class="status-badge">
              <span class="status-dot"></span>
              Payment Successful
            </span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-section">
            <h3>Bill To</h3>
            <div class="info-row">
              <span class="label">Business Name</span>
              <span class="value">${orderData.businessName || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Email Address</span>
              <span class="value">${orderData.email || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Date of Purchase</span>
              <span class="value">${orderData.date} ${orderData.time}</span>
            </div>
          </div>

          <div class="info-section">
            <h3>Payment Details</h3>
            <div class="info-row">
              <span class="label">Payment Method</span>
              <span class="value">${orderData.cardType || 'Card'} •••• ${orderData.cardLast4 || 'XXXX'}</span>
            </div>
            <div class="info-row">
              <span class="label">Transaction ID</span>
              <span class="value" style="font-family: 'Courier New', monospace; font-size: 12px;">${orderData.transactionId || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Payment Status</span>
              <span class="value" style="color: #16a34a; font-weight: 600;">✓ Completed</span>
            </div>
          </div>
        </div>

        <table class="details-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: center;">Billing Cycle</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div style="font-weight: 600; margin-bottom: 4px;">${orderData.planName}</div>
                <div style="font-size: 12px; color: #6b7280;">Subscription Plan</div>
              </td>
              <td style="text-align: center;">
                <span class="badge">${orderData.billingCycle}</span>
              </td>
              <td style="text-align: center; color: #16a34a; font-weight: 600;">Active</td>
              <td style="text-align: right; font-weight: 600;">${formatPrice(orderData.planPrice, orderData.currencySymbol)}</td>
            </tr>
          </tbody>
        </table>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px; border: 1px solid #e5e7eb;">
          <div class="info-row">
            <span class="label">Subscription Start Date</span>
            <span class="value">${orderData.planStartDate}</span>
          </div>
          <div class="info-row">
            <span class="label">Next Billing Date</span>
            <span class="value">${orderData.planEndDate}</span>
          </div>
        </div>

        <div class="totals-section">
          <div class="subtotal-row">
            <span>Subtotal</span>
            <span>${formatPrice(orderData.planPrice, orderData.currencySymbol)}</span>
          </div>
          <div class="subtotal-row">
            <span>Tax (Included)</span>
            <span>${orderData.currencySymbol}0.00</span>
          </div>
          <div class="total-row">
            <span>Total Amount Paid</span>
            <span>${formatPrice(orderData.planPrice, orderData.currencySymbol)}</span>
          </div>
        </div>

        <div class="footer">
          <p class="footer-text">Thank you for your business!</p>
          <p class="footer-text">This is an official receipt for your records.</p>
          <p class="footer-text">For questions or support, please contact us at:</p>
          <p class="footer-contact">support@yourcompany.com</p>
        </div>
      </body>
    </html>
  `;
};