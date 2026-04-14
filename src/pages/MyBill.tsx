import { useState, useEffect } from 'react';
import { getOrders, updateOrderPayment } from '../api/orderService';
import { Receipt, QrCode, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

const MyBill = () => {
  const [bills, setBills] = useState([]);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = () => {
      const allOrders = getOrders();
      const myOrderIds = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
      
      // Filter orders that are 'On Delivery' and belong to this customer
      const activeBills = allOrders.filter(order => 
        myOrderIds.includes(order.id) && 
        order.status === 'On Delivery'
      );
      
      setBills(activeBills);
    };

    fetchBills();
    const interval = setInterval(fetchBills, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (orderId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploading(orderId);
        // Simulate upload delay
        setTimeout(() => {
          updateOrderPayment(orderId, { 
            paymentScreenshot: reader.result,
            paymentStatus: 'Paid' 
          });
          setUploading(null);
          alert("Payment proof uploaded successfully!");
          // Refresh bills
          const allOrders = getOrders();
          const myOrderIds = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
          setBills(allOrders.filter(order => myOrderIds.includes(order.id) && order.status === 'On Delivery'));
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-2xl text-primary">
          <Receipt size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Bill</h1>
          <p className="text-gray-500 text-sm font-medium">Billing statements for your active orders</p>
        </div>
      </div>

      {bills.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Bills</h3>
          <p className="text-gray-500 max-w-xs mx-auto">Bills will appear here once your order is "On Delivery".</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {bills.map(bill => (
            <div key={bill.id} className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-dark p-6 text-white flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Order ID</p>
                  <h3 className="text-xl font-bold font-mono">{bill.id}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Amount</p>
                  <h3 className="text-2xl font-bold text-primary">₱{bill.total}</h3>
                </div>
              </div>

              <div className="p-8">
                {bill.paymentMethod === 'GCash' ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                        <div className="flex items-center gap-3 mb-4 text-blue-700">
                          <QrCode size={24} />
                          <h4 className="font-bold">GCash Payment</h4>
                        </div>
                        <div className="bg-white p-4 rounded-2xl shadow-inner mb-4 flex justify-center">
                          {/* Placeholder QR Code */}
                          <div className="w-48 h-48 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl relative overflow-hidden">
                             <img 
                                src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Gcash:09123456789" 
                                alt="GCash QR Code" 
                                className="w-full h-full object-contain"
                             />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-bold text-blue-900">GIP'S KITCHEN</p>
                          <p className="text-lg font-black text-blue-700 tracking-wider">0912 345 6789</p>
                          <p className="text-[10px] text-blue-500 uppercase font-bold mt-1">Scan or use number if scanning fails</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <h4 className="text-lg font-bold text-gray-800 mb-4">Upload Receipt</h4>
                      {bill.paymentScreenshot ? (
                        <div className="space-y-4">
                          <div className="relative rounded-2xl overflow-hidden border-4 border-green-500 shadow-lg aspect-[9/16] max-h-64 mx-auto">
                            <img src={bill.paymentScreenshot} alt="Receipt" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                              <CheckCircle2 size={48} className="text-white drop-shadow-md" />
                            </div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-2xl flex items-center gap-3 text-green-700 border border-green-100">
                            <CheckCircle2 size={20} />
                            <span className="text-sm font-bold">Payment proof submitted. Waiting for confirmation.</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-sm text-gray-500 mb-4">Please upload a screenshot of your GCash transaction receipt to complete your payment.</p>
                          <label className={`
                            flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-3xl cursor-pointer transition-all
                            ${uploading === bill.id ? 'bg-gray-50 border-gray-300' : 'bg-gray-50 border-gray-200 hover:border-primary hover:bg-primary/5'}
                          `}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {uploading === bill.id ? (
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                              ) : (
                                <>
                                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                  <p className="mb-2 text-sm text-gray-500 font-bold">Click to upload screenshot</p>
                                  <p className="text-xs text-gray-400 uppercase font-bold">PNG, JPG or JPEG</p>
                                </>
                              )}
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(bill.id, e)} disabled={uploading === bill.id} />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-8 rounded-3xl border border-yellow-100 flex flex-col items-center text-center">
                    <div className="bg-yellow-100 p-4 rounded-full text-yellow-700 mb-4">
                      <AlertCircle size={48} />
                    </div>
                    <h4 className="text-2xl font-bold text-yellow-900 mb-2">Cash on Delivery</h4>
                    <p className="text-yellow-700 font-medium max-w-sm">
                      Your order is on the way! Please prepare <span className="font-bold text-lg">₱{bill.total}</span> for your payment upon delivery.
                    </p>
                    <div className="mt-6 px-6 py-2 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-widest">
                      COD Status: Active
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBill;
