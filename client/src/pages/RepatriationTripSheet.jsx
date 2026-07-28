import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchVehicles } from '../api/vehicles';
import { fetchDrivers } from '../api/drivers';
import { saveRepatriationTrip, fetchLastClosingOdo } from '../api/repatriationTrips';

export default function RepatriationTripSheet() {
  const [form, setForm] = useState({
    deceased_name: '',
    deceased_id: '',
    policy_number: '',
    date_of_death: '',
    family_contact_name: '',
    family_contact_number: '',
    from_location: '',
    from_address: '',
    to_location: '',
    to_address: '',
    odometer_closing: '',
    time_out: '',
    time_in: '',
    vehicle_id: '',
    driver_id: '',
    collection_type: '',
    tag_number: ''
  });

  const [printMode, setPrintMode] = useState(false);
  const [lastClosingOdo, setLastClosingOdo] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [authError, setAuthError] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('tfs_last_odo_closing', String(form.odometer_closing || ''));
      }
    } catch (e) { }
    setPrintMode(true);
    setTimeout(() => window.print(), 300);
  };

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const v = window.localStorage.getItem('tfs_last_odo_closing');
        if (v !== null && v !== undefined) setLastClosingOdo(v);
      }
    } catch (e) { }
  }, []);

  useEffect(() => {
    // Load vehicles and drivers for selection
    const loadInitialData = async () => {
      try {
        const [vData, dData] = await Promise.all([
          fetchVehicles(),
          fetchDrivers()
        ]);
        setVehicles(vData);
        setDrivers(dData);
      } catch (error) {
        console.error('Error loading initial data:', error);
        if (error.response?.status === 401) {
          setAuthError('Your session has expired. Please login again to load vehicles and drivers.');
        }
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    // When vehicle changes, fetch last closing from API
    const loadLastClosing = async () => {
      if (!form.vehicle_id) return;
      try {
        const data = await fetchLastClosingOdo(form.vehicle_id);
        if (data && data.success) {
          setLastClosingOdo(data.last_closing ?? '');
        }
      } catch (error) {
        console.error('Error loading last odometer closing:', error);
        if (error.response?.status === 401) {
          setAuthError('Your session has expired. Please login again to load last odometer closing.');
        }
      }
    };
    loadLastClosing();
  }, [form.vehicle_id]);

  return (
    <div className="min-h-screen print:min-h-0 print:py-0 print:bg-white bg-gradient-to-br from-gray-50 to-gray-100 py-6">
      <div className="max-w-4xl mx-auto px-4 print:hidden">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-red-700">Repatriation Trip Sheet</h1>
          <button onClick={handlePrint} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">Print</button>
        </div>

        {authError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {authError} <Link to="/login" className="underline ml-1">Login</Link>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-red-800">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-semibold">Deceased Name</label>
                <input value={form.deceased_name} onChange={e => handleChange('deceased_name', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-semibold">Deceased ID Number</label>
                <input value={form.deceased_id} onChange={e => handleChange('deceased_id', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-semibold">Tag Number</label>
                <input value={form.tag_number} onChange={e => handleChange('tag_number', e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. A123" />
              </div>
              <div>
                <label className="text-sm font-semibold">Deceased Policy Number</label>
                <input value={form.policy_number} onChange={e => handleChange('policy_number', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-semibold">Date of Death</label>
                <input type="date" value={form.date_of_death} onChange={e => handleChange('date_of_death', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-semibold">Family Member Name</label>
                <input value={form.family_contact_name} onChange={e => handleChange('family_contact_name', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-semibold">Family Member Number</label>
                <input value={form.family_contact_number} onChange={e => handleChange('family_contact_number', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-bold text-red-800">Trip Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-semibold">Collection Type</label>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-2 border rounded hover:bg-gray-50">
                    <input type="radio" name="collection_type" value="book" checked={form.collection_type === 'book'} onChange={e => handleChange('collection_type', e.target.value)} />
                    <span>Our Vehicle (Book)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-blue-50 px-3 py-2 border border-blue-200 rounded hover:bg-blue-100">
                    <input type="radio" name="collection_type" value="private" checked={form.collection_type === 'private'} onChange={e => {
                      setForm(prev => ({ ...prev, collection_type: e.target.value, time_out: '', odometer_closing: '' }));
                    }} />
                    <span>Private / Family</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-red-50 px-3 py-2 border border-red-200 rounded hover:bg-red-100">
                    <input type="radio" name="collection_type" value="ems" checked={form.collection_type === 'ems'} onChange={e => {
                      setForm(prev => ({ ...prev, collection_type: e.target.value, time_out: '', odometer_closing: '' }));
                    }} />
                    <span className="font-semibold text-red-800">EMS / Ambulance</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-yellow-50 px-3 py-2 border border-yellow-200 rounded hover:bg-yellow-100">
                    <input type="radio" name="collection_type" value="police" checked={form.collection_type === 'police'} onChange={e => {
                      setForm(prev => ({ ...prev, collection_type: e.target.value, time_out: '', odometer_closing: '' }));
                    }} />
                    <span>Police / Forensic</span>
                  </label>
                </div>
              </div>
              {!['ems', 'police', 'family', 'private'].includes(form.collection_type) && (
                <>
                  <div>
                    <label className="text-sm font-semibold">Vehicle</label>
                    <select value={form.vehicle_id || ''} onChange={e => handleChange('vehicle_id', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                      <option value="">Select vehicle</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.reg_number} • {v.type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Driver</label>
                    <select value={form.driver_id || ''} onChange={e => handleChange('driver_id', e.target.value)} className="w-full px-4 py-2 border rounded-lg">
                      <option value="">Select driver</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="text-sm font-semibold">From</label>
                <input value={form.from_location} onChange={e => handleChange('from_location', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-semibold">Address</label>
                <input value={form.from_address} onChange={e => handleChange('from_address', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-semibold">To</label>
                <input value={form.to_location} onChange={e => handleChange('to_location', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="text-sm font-semibold">Address</label>
                <input value={form.to_address} onChange={e => handleChange('to_address', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-semibold">Odometer Closing (km)</label>
                <input type="number"
                  disabled={['ems', 'police', 'family', 'private'].includes(form.collection_type)}
                  value={form.odometer_closing}
                  onChange={e => handleChange('odometer_closing', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg ${['ems', 'police', 'family', 'private'].includes(form.collection_type) ? 'bg-gray-100 text-gray-400' : ''}`}
                  placeholder={['ems', 'police', 'family', 'private'].includes(form.collection_type) ? 'N/A' : ''}
                />
                {!['ems', 'police', 'family'].includes(form.collection_type) && (
                  <>
                    <p className="text-xs text-gray-600 mt-1">Previous closing: {lastClosingOdo || 'N/A'}</p>
                    <p className="text-sm font-semibold text-red-700 mt-1">KM traveled: {(() => {
                      const last = parseFloat(lastClosingOdo);
                      const clos = parseFloat(form.odometer_closing);
                      if (!isNaN(last) && !isNaN(clos) && clos >= last) {
                        return (clos - last).toString();
                      }
                      return 'N/A';
                    })()}</p>
                  </>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold">Time Out</label>
                <input
                  value={form.time_out}
                  onChange={e => handleChange('time_out', e.target.value)}
                  disabled={['ems', 'police', 'family', 'private'].includes(form.collection_type)}
                  className={`w-full px-4 py-2 border rounded-lg ${['ems', 'police', 'family', 'private'].includes(form.collection_type) ? 'bg-gray-100 text-gray-400' : ''}`}
                  placeholder={['ems', 'police', 'family', 'private'].includes(form.collection_type) ? 'N/A' : ''}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Time In</label>
                <input value={form.time_in} onChange={e => handleChange('time_in', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>
          <div className="p-6 border-t flex gap-3">
            <button onClick={async () => {
              try {
                const idVal = (form.deceased_id || '').trim();
                if (idVal && !/^\d{13}$/.test(idVal)) {
                  alert('ID number must be exactly 13 digits');
                  console.warn('Invalid ID number provided:', idVal);
                  return;
                }
                const policyCandidate = (form.policy_number || '').trim() || (idVal && /^\d{13}$/.test(idVal) ? idVal : '');
                const payload = {
                  vehicle_id: form.vehicle_id || null,
                  driver_id: form.driver_id || null,
                  case_id: null,
                  deceased_name: form.deceased_name || '',
                  deceased_id: form.deceased_id || '',
                  policy_number: policyCandidate,
                  family_contact_name: form.family_contact_name || '',
                  family_contact_number: form.family_contact_number || '',
                  date_of_death: form.date_of_death || '',
                  from_location: form.from_location,
                  from_address: form.from_address,
                  to_location: form.to_location,
                  to_address: form.to_address,
                  odometer_closing: form.odometer_closing ? parseInt(form.odometer_closing) : null,
                  time_out: form.time_out,
                  time_in: form.time_in,
                  notes: form.collection_type === 'ems' ? `EMS Reference: ${form.tag_number || 'N/A'}` : null,
                  collection_type: form.collection_type || null,
                  tag_number: form.tag_number || null,
                  created_by: 'system'
                };

                const json = await saveRepatriationTrip(payload);

                if (json && json.success) {
                  const last = json.last_closing ?? '';
                  setLastClosingOdo(last);
                  if (json.duplicates_found) {
                    console.warn('Duplicate case detection info:', json.duplicate_info);
                    alert(`Warning: Possible duplicate case detected. Matches by: ${Object.entries(json.duplicate_info || {}).filter(([_, v]) => v && v.count > 0).map(([k, v]) => `${k} (${v.count})`).join(', ')}`);
                  }
                  if (json.case_number) {
                    console.log('Linked/Created case_number:', json.case_number);
                  }
                  alert(`Trip saved. KM traveled: ${json.trip.km_traveled ?? 'N/A'}`);
                  setForm({
                    deceased_name: '',
                    deceased_id: '',
                    policy_number: '',
                    date_of_death: '',
                    family_contact_name: '',
                    family_contact_number: '',
                    from_location: '',
                    from_address: '',
                    to_location: '',
                    to_address: '',
                    odometer_closing: '',
                    time_out: '',
                    time_in: '',
                    vehicle_id: '',
                    driver_id: '',
                    collection_type: '',
                    tag_number: ''
                  });
                } else {
                  alert(`Error: ${json.error || 'Failed to save trip'}`);
                }
              } catch (error) {
                console.error('Error saving trip:', error);
                const errorMsg = error.response?.data?.error || error.message || 'Error saving trip';
                alert(`Error: ${errorMsg}`);
              }
            }} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold">Save Trip</button>
            <button onClick={handlePrint} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">Print</button>
          </div>
        </div>
      </div>

      {printMode && (
        <div id="tfs-print-root" className="p-6">
          <style>{`@media print { body, html { margin:0; padding: 0; height: auto; overflow: visible; } @page { size: A4; margin: 10mm; } #root, .min-h-screen { min-height: 0 !important; height: auto !important; padding: 0 !important; margin: 0 !important; } body * { visibility: hidden !important; } #tfs-print-root, #tfs-print-root * { visibility: visible !important; } #tfs-print-root { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-4">
              <img src="/logo_full.png" alt="Thusanang Logo" className="h-20 mx-auto object-contain" />
            </div>
            <h2 className="text-center text-xl font-bold bg-red-600 text-white py-2">REPARTRIATION TRIP SHEET</h2>
            <h3 className="text-center font-bold text-red-800 mt-3">CUSTOMER INFORMATION</h3>
            <table className="w-full border-collapse mt-2 mb-4 text-sm">
              <tbody>
                <tr><td className="border p-2 w-1/2">DECEASED NAME:</td><td className="border p-2">{form.deceased_name}</td></tr>
                <tr><td className="border p-2">DECEASED ID NUMBER:</td><td className="border p-2">{form.deceased_id}</td></tr>
                <tr><td className="border p-2">TAG NUMBER:</td><td className="border p-2">{form.tag_number}</td></tr>
                <tr><td className="border p-2">DECEASED POLICY NUMBER:</td><td className="border p-2">{form.policy_number}</td></tr>
                <tr><td className="border p-2">DATE OF DEATH:</td><td className="border p-2">{form.date_of_death}</td></tr>
                <tr><td className="border p-2">FAMILY MEMBER CONTACTS:</td><td className="border p-2">NAME: {form.family_contact_name} • NUMBER: {form.family_contact_number}</td></tr>
              </tbody>
            </table>

            <h3 className="text-center font-bold text-red-800 mt-3">TRIP INFORMATION</h3>
            <table className="w-full border-collapse mt-2 text-sm">
              <tbody>
                <tr><td className="border p-2 w-1/2">FROM:</td><td className="border p-2">{form.from_location}</td></tr>
                <tr><td className="border p-2">ADDRESS:</td><td className="border p-2">{form.from_address}</td></tr>
                <tr><td className="border p-2">TO:</td><td className="border p-2">{form.to_location}</td></tr>
                <tr><td className="border p-2">ADDRESS:</td><td className="border p-2">{form.to_address}</td></tr>
                <tr><td className="border p-2">ODOMETER CLOSING (KM)</td><td className="border p-2">{form.odometer_closing}</td></tr>
                <tr><td className="border p-2">KM TRAVELED</td><td className="border p-2">{(() => {
                  const last = parseFloat(lastClosingOdo);
                  const clos = parseFloat(form.odometer_closing);
                  if (!isNaN(last) && !isNaN(clos) && clos >= last) {
                    return (clos - last).toString();
                  }
                  return 'N/A';
                })()}</td></tr>
                <tr><td className="border p-2">TIME:</td><td className="border p-2">OUT: {form.time_out} • IN: {form.time_in}</td></tr>
              </tbody>
            </table>

            <p className="text-center mt-4 text-lg font-bold">RESPECTFUL | PROFESSIONAL | DIGNIFIED</p>
          </div>
        </div>
      )}
    </div>
  );
}
