import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, Filter } from 'lucide-react';

const Analytics = () => {
  const [departmentData, setDepartmentData] = useState([]);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState('6months');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockBookmarkTrends = useMemo(() => ({
    '3months': [
      { date: "2024-03", bookmarks: 22, month: "Mar" },
      { date: "2024-04", bookmarks: 18, month: "Apr" },
      { date: "2024-05", bookmarks: 30, month: "May" },
    ],
    '6months': [
      { date: "2023-12", bookmarks: 8, month: "Dec" },
      { date: "2024-01", bookmarks: 10, month: "Jan" },
      { date: "2024-02", bookmarks: 15, month: "Feb" },
      { date: "2024-03", bookmarks: 22, month: "Mar" },
      { date: "2024-04", bookmarks: 18, month: "Apr" },
      { date: "2024-05", bookmarks: 30, month: "May" },
    ],
    '1year': [
      { date: "2023-06", bookmarks: 5, month: "Jun '23" },
      { date: "2023-07", bookmarks: 7, month: "Jul '23" },
      { date: "2023-08", bookmarks: 12, month: "Aug '23" },
      { date: "2023-09", bookmarks: 9, month: "Sep '23" },
      { date: "2023-10", bookmarks: 14, month: "Oct '23" },
      { date: "2023-11", bookmarks: 6, month: "Nov '23" },
      { date: "2023-12", bookmarks: 8, month: "Dec '23" },
      { date: "2024-01", bookmarks: 10, month: "Jan '24" },
      { date: "2024-02", bookmarks: 15, month: "Feb '24" },
      { date: "2024-03", bookmarks: 22, month: "Mar '24" },
      { date: "2024-04", bookmarks: 18, month: "Apr '24" },
      { date: "2024-05", bookmarks: 30, month: "May '24" },
    ]
  }), []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/users?limit=100');
        const data = await response.json();
        
        const departmentMap = {};
        
        data.users.forEach(user => {
          const department = user.company?.department || 'Unknown';
          const rating = 3.0 + (user.id % 21) / 10;
          
          if (!departmentMap[department]) {
            departmentMap[department] = {
              department,
              totalRating: 0,
              count: 0,
              employees: []
            };
          }
          
          departmentMap[department].totalRating += rating;
          departmentMap[department].count += 1;
          departmentMap[department].employees.push({
            name: `${user.firstName} ${user.lastName}`,
            rating
          });
        });

        const processedData = Object.values(departmentMap).map(dept => ({
          department: dept.department,
          averageRating: Math.round((dept.totalRating / dept.count) * 10) / 10,
          employeeCount: dept.count,
          employees: dept.employees
        })).sort((a, b) => b.averageRating - a.averageRating);

        setDepartmentData(processedData);
        setBookmarkData(mockBookmarkTrends[selectedDateRange]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [mockBookmarkTrends, selectedDateRange]);

  useEffect(() => {
    setBookmarkData(mockBookmarkTrends[selectedDateRange]);
  }, [selectedDateRange, mockBookmarkTrends]);

  const filteredDepartmentData = selectedDepartment === 'all' 
    ? departmentData 
    : departmentData.filter(dept => dept.department === selectedDepartment);

  const uniqueDepartments = departmentData.map(dept => dept.department);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 dark:text-red-400 text-2xl">⚠</span>
          </div>
          <p className="text-red-500 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-2 sm:p-4 lg:p-6 xl:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Comprehensive insights into department performance and engagement trends</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 lg:p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Total Departments</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{departmentData.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 lg:p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Avg Rating</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {departmentData.length > 0 
                    ? Math.round((departmentData.reduce((sum, dept) => sum + dept.averageRating, 0) / departmentData.length) * 10) / 10
                    : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 lg:p-6 hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">This Month Bookmarks</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {bookmarkData.length > 0 ? bookmarkData[bookmarkData.length - 1].bookmarks : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">Department Average Ratings</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Performance ratings by department</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Departments</option>
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredDepartmentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                  <XAxis 
                    dataKey="department" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <Tooltip 
                    formatter={(value, name) => [value.toFixed(1), 'Average Rating']}
                    labelFormatter={(label) => `Department: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgb(249 250 251)',
                      border: '1px solid rgb(229 231 235)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: 'rgb(17 24 39)'
                    }}
                    wrapperClassName="dark:[&>div]:!bg-gray-800 dark:[&>div]:!border-gray-600 dark:[&>div]:!text-gray-100"
                  />
                  <Legend />
                  <Bar 
                    dataKey="averageRating" 
                    fill="#3B82F6" 
                    name="Average Rating"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 lg:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6">
              <div className="mb-4 lg:mb-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">Bookmark Trends</h2>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Engagement trends over time</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                </select>
              </div>
            </div>
            
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={bookmarkData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="bookmarkGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: 'currentColor' }}
                    className="text-gray-600 dark:text-gray-300"
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Bookmarks']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      backgroundColor: 'rgb(249 250 251)',
                      border: '1px solid rgb(229 231 235)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: 'rgb(17 24 39)'
                    }}
                    wrapperClassName="dark:[&>div]:!bg-gray-800 dark:[&>div]:!border-gray-600 dark:[&>div]:!text-gray-100"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bookmarks" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#bookmarkGradient)" 
                    name="Bookmarks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 lg:p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Department Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Average Rating
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employees
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {departmentData.map((dept, index) => (
                  <tr key={dept.department} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="truncate max-w-32 sm:max-w-none" title={dept.department}>
                        {dept.department}
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex items-center">
                        <span className="mr-2">{dept.averageRating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < Math.floor(dept.averageRating) ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {dept.employeeCount}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        dept.averageRating >= 4.5 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' 
                          : dept.averageRating >= 4.0 
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' 
                          : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                      }`}>
                        {dept.averageRating >= 4.5 ? 'Excellent' : dept.averageRating >= 4.0 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;