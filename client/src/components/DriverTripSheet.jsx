import React, { forwardRef } from 'react';

const SingleTripReceipt = ({ assignment, caseData, groupName }) => {
    return (
        <div className="border border-gray-400 p-4 m-2 bg-white text-black font-sans shadow-sm print:shadow-none" style={{ width: '46%', display: 'inline-block', verticalAlign: 'top', minHeight: '12cm', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <div className="flex justify-between items-start border-b-2 border-red-700 pb-2 mb-3">
                <div className="flex-1 pr-2">
                    <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900 leading-tight">Driver Trip Sheet</h1>
                    <p className="text-xs text-red-600 font-bold uppercase mt-1 tracking-wide">{groupName || 'Transport Group'}</p>
                </div>
                <div className="text-right">
                    <div className="font-bold text-sm bg-gray-100 px-2 py-1 rounded border border-gray-200">{caseData.case_number}</div>
                    <div className="text-[10px] text-gray-500 mt-1 font-semibold">{new Date().toLocaleDateString('en-ZA')}</div>
                </div>
            </div>

            {/* Transport Info */}
            <div className="mb-4 bg-gray-50 p-2 rounded border border-gray-200">
                <div className="text-xs uppercase tracking-wide border-b border-gray-300 pb-1 mb-2 font-bold text-gray-700 flex justify-between items-center">
                    <span>Transport Info</span>
                    {assignment.assignment_role && <span className="text-[10px] text-red-700 bg-red-100 px-1.5 py-0.5 rounded">{assignment.assignment_role}</span>}
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                    <div className="flex">
                        <span className="text-gray-600 font-semibold w-20">Driver:</span>
                        <span className="font-bold text-gray-900 flex-1 truncate">{assignment.driver_name || "TBD"}</span>
                    </div>
                    <div className="flex">
                        <span className="text-gray-600 font-semibold w-20">Vehicle:</span>
                        <span className="font-bold text-gray-900 flex-1 truncate">{assignment.external_vehicle || assignment.reg_number || 'Not Assigned'}</span>
                    </div>
                    <div className="flex">
                        <span className="text-gray-600 font-semibold w-20">Time:</span>
                        <span className="font-bold text-gray-900 flex-1">
                            {assignment.pickup_time ? new Date(assignment.pickup_time).toLocaleString('en-ZA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : (caseData.funeral_time || 'TBA')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Case Info */}
            <div className="mb-4">
                <div className="text-xs uppercase tracking-wide font-bold border-b border-gray-200 pb-1 mb-2 text-gray-700">Case Details</div>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                    <div className="flex">
                        <span className="text-gray-500 font-semibold w-20">Deceased:</span>
                        <span className="font-bold text-gray-900 flex-1">{caseData.deceased_name}</span>
                    </div>
                    <div className="flex">
                        <span className="text-gray-500 font-semibold w-20">Date:</span>
                        <span className="font-bold text-gray-900 flex-1">{caseData.funeral_date ? new Date(caseData.funeral_date).toLocaleDateString() : 'TBA'}</span>
                    </div>
                    <div className="flex">
                        <span className="text-gray-500 font-semibold w-20">Next of Kin:</span>
                        <span className="font-bold text-gray-900 flex-1">{caseData.nok_name || 'TBA'}</span>
                    </div>
                    <div className="flex">
                        <span className="text-gray-500 font-semibold w-20">Contact:</span>
                        <span className="font-bold text-gray-900 flex-1">{caseData.nok_contact || 'TBA'}</span>
                    </div>
                </div>
            </div>

            {/* Destinations */}
            <div className="space-y-3 mb-4">
                <div className="border-l-4 border-yellow-500 pl-3">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Collection / Home</div>
                    <div className="text-xs font-semibold text-gray-800">
                        {caseData.venue_address || <span className="italic text-gray-400 font-normal">Not specified</span>}
                    </div>
                </div>
                
                <div className="border-l-4 border-red-600 pl-3">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Service Venue</div>
                    <div className="text-xs font-semibold text-gray-800">
                        {caseData.venue_name || <span className="italic text-gray-400 font-normal">Not specified</span>}
                    </div>
                    {caseData.venue_name && caseData.venue_address && (
                        <div className="text-[10px] text-gray-500 mt-0.5">{caseData.venue_address}</div>
                    )}
                </div>

                <div className="border-l-4 border-gray-800 pl-3">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Burial Place</div>
                    <div className="text-xs font-semibold text-gray-800">
                        {caseData.burial_place || <span className="italic text-gray-400 font-normal">Not specified</span>}
                    </div>
                </div>
            </div>

            {/* Driver Packing Checklist */}
            <div className="mb-4 bg-gray-50 p-2 rounded border border-gray-200 break-inside-avoid">
                <div className="text-[10px] uppercase tracking-wide border-b border-gray-300 pb-1 mb-2 font-bold text-gray-700">Driver Packing Checklist</div>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold text-gray-800">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-gray-400 bg-white"></div>
                        <span className="truncate">Coffin: {caseData.casket_type || 'Verify'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-gray-400 bg-white"></div>
                        <span>Crucifix</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-gray-400 bg-white"></div>
                        <span>Fresh Flowers</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border border-gray-400 bg-white"></div>
                        <span>Coffin Screen / Canvas</span>
                    </div>
                    {(caseData.church_time || caseData.church_date || (caseData.venue_name && caseData.venue_name.toLowerCase().includes('church'))) && (
                        <div className="flex items-center gap-2 col-span-2">
                            <div className="w-3 h-3 border border-red-400 bg-white"></div>
                            <span className="text-red-700">Church Trolley / Coffin Stands</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Service Discipline & Comments */}
            <div className="mt-2 border border-red-800 p-1.5 bg-red-50 text-[8px] text-red-900 rounded break-inside-avoid shadow-sm">
                <p className="uppercase font-bold mb-0.5">Time Management Agreement</p>
                <p className="leading-tight">If service or departure is delayed by more than 20 mins from scheduled time, Thusanang drivers reserve the right to depart for other scheduled services.</p>
            </div>

            <div className="mt-3 border border-gray-300 p-2 rounded break-inside-avoid bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-[9px] font-bold uppercase text-gray-600">Driver Comments / Incident Report</p>
                    <p className="text-[8px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded border border-red-200">⚠️ MANDATORY: CALL OFFICE BEFORE DEPARTING</p>
                </div>
                <div className="border-b border-dotted border-gray-400 mb-4"></div>
                <div className="border-b border-dotted border-gray-400 mb-2"></div>
            </div>

            <div className="mt-5 pt-2 flex gap-6 break-inside-avoid">
                <div className="flex-1">
                    <div className="border-b border-gray-400 h-4"></div>
                    <div className="text-[9px] text-center text-gray-500 mt-1.5 uppercase font-semibold">Driver Sign-Off</div>
                </div>
                <div className="flex-1">
                    <div className="border-b border-gray-400 h-4"></div>
                    <div className="text-[9px] text-center text-gray-500 mt-1.5 uppercase font-semibold">Manager Acknowledgement</div>
                </div>
            </div>
        </div>
    );
};

const DriverTripSheet = forwardRef(({ group, caseData, batch }, ref) => {
    // If 'batch' is provided, it's an array of print items: { caseData, assignment, groupName }
    // If 'group' is provided, we extract assignments from the single group.
    
    let printItems = [];
    
    if (batch && batch.length > 0) {
        printItems = batch;
    } else if (group && caseData && group.assignments) {
        printItems = group.assignments.map(assign => ({
            caseData,
            assignment: assign,
            groupName: group.groupName
        }));
    }

    if (printItems.length === 0) return null;

    return (
        <div ref={ref} className="print:m-0 print:p-0" style={{ width: '100%', maxWidth: '21cm', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            <style type="text/css" media="print">
                {`
                  @page { size: portrait; margin: 5mm; }
                  @media print {
                    .border-red-700 { border-color: #b91c1c !important; }
                    .border-yellow-500 { border-color: #eab308 !important; }
                    .border-red-600 { border-color: #dc2626 !important; }
                    .bg-gray-50 { background-color: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .bg-gray-100 { background-color: #f3f4f6 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .bg-red-100 { background-color: #fee2e2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                  }
                `}
            </style>
            {printItems.map((item, index) => (
                <SingleTripReceipt 
                    key={index}
                    assignment={item.assignment}
                    caseData={item.caseData}
                    groupName={item.groupName}
                />
            ))}
        </div>
    );
});

export default DriverTripSheet;
