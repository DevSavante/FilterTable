import { useState, useEffect } from 'react';
import data from '/src/data.json'; // Ensure this is the correct path

// Utility function to format strings (e.g., "POLICY_NUMBER" -> "Policy Number")
const formatString = (str) => {
  return str
    .toLowerCase()         // Convert to lowercase
    .replace(/_/g, ' ')    // Replace underscores with spaces
    .replace(/\b\w/g, (l) => l.toUpperCase()); // Capitalize first letter of each word
};

const FilterableTable = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Filter data based on status filter and search term
    const filterData = () => {
      let filtered = data;

      // Apply status filter if it's not 'ALL'
      if (statusFilter !== 'ALL') {
        // Custom logic for 'TERMINATED' to show 'DEATH' and 'MATURED'
        if (statusFilter === 'TERMINATED') {
          filtered = filtered.filter(
            (item) => item.STATUS === 'DEATH' || item.STATUS === 'MATURED'
          );
        } else {
          filtered = filtered.filter((item) => item.STATUS === statusFilter);
        }
      }

      // Apply search term filtering across all columns
      if (searchTerm) {
        filtered = filtered.filter((item) =>
          Object.values(item).some((value) =>
            // Convert value to string safely and check if it includes the search term
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      setFilteredData(filtered);
    };

    filterData();
  }, [statusFilter, searchTerm]);

  // Column headers (formatted)
  const headers = [
    'PROPOSAL_NUMBER',
    'POLICY_NUMBER',
    'ISSUE_DATE',
    'MATURITY_DATE',
    'STATUS',
    'PRODUCT',
    'CLIENT',
    'PREMIUM'
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search across all columns"
          className="border rounded px-4 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter Buttons */}
        <div>
          {['ALL', 'ACTIVE', 'SURRENDERED', 'CANCELLED', 'DRAFT', 'TERMINATED', 'LAPSE'].map((status) => (
            <button
              key={status}
              className={`px-4 py-2 mx-1 rounded ${statusFilter === status ? 'bg-indigo-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setStatusFilter(status)}
            >
              {formatString(status)} {/* Format buttons */}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className="text-left px-4 py-2 border">
                {formatString(header)} {/* Format headers */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.PROPOSAL_NUMBER}>
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2 border">
                    {header === 'STATUS' ? formatString(item[header]) : item[header]} {/* Format status */}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="text-center py-4">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilterableTable;
