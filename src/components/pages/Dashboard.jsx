import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Bookmark, Eye, TrendingUp, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Dashboard = ({ onNavigate }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false);
  const [showRatingFilter, setShowRatingFilter] = useState(false);
  const [promotedUser, setPromotedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalUsers, setTotalUsers] = useState(0);

  const generateRating = () => Math.floor(Math.random() * 5) + 1;

  const loadBookmarks = () => {
    try {
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarkedEmployees') || '[]');
      const bookmarkIds = new Set(savedBookmarks.map(emp => emp.id));
      setBookmarks(bookmarkIds);
      return savedBookmarks;
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  };

  const saveBookmarks = (bookmarkedEmployees) => {
    try {
      localStorage.setItem('bookmarkedEmployees', JSON.stringify(bookmarkedEmployees));
      window.dispatchEvent(new CustomEvent('bookmarksChanged'));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    const handleBookmarkChange = () => {
      loadBookmarks();
    };

    window.addEventListener('bookmarksChanged', handleBookmarkChange);
    
    return () => {
      window.removeEventListener('bookmarksChanged', handleBookmarkChange);
    };
  }, []);

  const fetchUsers = async (page = 1, limit = 50) => {
    try {
      setLoading(true);
      const skip = (page - 1) * limit;
      const response = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
      const data = await response.json();
      
      const usersWithRatings = data.users.map(user => ({
        ...user,
        rating: generateRating()
      }));
      
      return {
        users: usersWithRatings,
        total: data.total
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { users: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialUsers = async () => {
      const { users: fetchedUsers, total } = await fetchUsers(1, 50);
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
      setTotalUsers(total);
    };

    loadInitialUsers();
  }, []);

  const departments = [...new Set(users.map(user => user.company?.department).filter(Boolean))];
  const ratings = [1, 2, 3, 4, 5];

  useEffect(() => {
    let filtered = users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const department = user.company?.department?.toLowerCase() || '';
      
      const matchesSearch = 
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        department.includes(searchTerm.toLowerCase());

      const matchesDepartment = selectedDepartments.length === 0 || 
        selectedDepartments.includes(user.company?.department);
      
      const matchesRating = selectedRatings.length === 0 || 
        selectedRatings.includes(user.rating);

      return matchesSearch && matchesDepartment && matchesRating;
    });

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedDepartments, selectedRatings, users]);

  const totalFilteredPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalFilteredPages)));
  };

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNext = () => {
    if (currentPage < totalFilteredPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const toggleBookmark = (user) => {
    try {
      const currentBookmarks = JSON.parse(localStorage.getItem('bookmarkedEmployees') || '[]');
      const isBookmarked = currentBookmarks.some(emp => emp.id === user.id);
      
      let updatedBookmarks;
      if (isBookmarked) {
        updatedBookmarks = currentBookmarks.filter(emp => emp.id !== user.id);
      } else {
        updatedBookmarks = [...currentBookmarks, user];
      }
      
      saveBookmarks(updatedBookmarks);
      
      const bookmarkIds = new Set(updatedBookmarks.map(emp => emp.id));
      setBookmarks(bookmarkIds);
      
      console.log(`Bookmark ${isBookmarked ? 'removed' : 'added'} for ${user.firstName} ${user.lastName}`);
      
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handlePromote = (user) => {
    setPromotedUser(user);
    setTimeout(() => setPromotedUser(null), 3000);
  };

  const handleView = (userId) => {
    if (onNavigate) {
      onNavigate('employees', { employeeId: userId });
    }
  };

  const clearFilters = () => {
    setSelectedDepartments([]);
    setSelectedRatings([]);
    setSearchTerm('');
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600 dark:text-gray-400">
          ({rating}/5)
        </span>
      </div>
    );
  };

  const renderPagination = () => {
    if (totalFilteredPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalFilteredPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg border ${
              currentPage === 1
                ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                1
              </button>
              {startPage > 2 && (
                <span className="text-gray-400 dark:text-gray-600">...</span>
              )}
            </>
          )}

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`px-3 py-2 rounded-lg border ${
                currentPage === number
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {number}
            </button>
          ))}

          {endPage < totalFilteredPages && (
            <>
              {endPage < totalFilteredPages - 1 && (
                <span className="text-gray-400 dark:text-gray-600">...</span>
              )}
              <button
                onClick={() => goToPage(totalFilteredPages)}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {totalFilteredPages}
              </button>
            </>
          )}

          <button
            onClick={goToNext}
            disabled={currentPage === totalFilteredPages}
            className={`p-2 rounded-lg border ${
              currentPage === totalFilteredPages
                ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your team's performance and track employee data
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowDepartmentFilter(!showDepartmentFilter)}
              className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <Filter className="w-4 h-4" />
              <span>Department</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showDepartmentFilter ? 'rotate-180' : ''}`} />
            </button>
            
            {showDepartmentFilter && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <div className="p-3 space-y-2">
                  {departments.map(dept => (
                    <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDepartments.includes(dept)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDepartments([...selectedDepartments, dept]);
                          } else {
                            setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{dept}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowRatingFilter(!showRatingFilter)}
              className="flex items-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors w-full sm:w-auto justify-center sm:justify-start"
            >
              <Star className="w-4 h-4" />
              <span>Rating</span>
              <ChevronDown className={`w-4 h-4 transform transition-transform ${showRatingFilter ? 'rotate-180' : ''}`} />
            </button>
            
            {showRatingFilter && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                <div className="p-3 space-y-2">
                  {ratings.map(rating => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRatings([...selectedRatings, rating]);
                          } else {
                            setSelectedRatings(selectedRatings.filter(r => r !== rating));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-700 dark:text-gray-300">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(selectedDepartments.length > 0 || selectedRatings.length > 0 || searchTerm) && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {(selectedDepartments.length > 0 || selectedRatings.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedDepartments.map(dept => (
              <span key={dept} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {dept}
                <button
                  onClick={() => setSelectedDepartments(selectedDepartments.filter(d => d !== dept))}
                  className="ml-1.5 text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedRatings.map(rating => (
              <span key={rating} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                {rating} stars
                <button
                  onClick={() => setSelectedRatings(selectedRatings.filter(r => r !== rating))}
                  className="ml-1.5 text-yellow-600 hover:text-yellow-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {currentUsers.length} of {filteredUsers.length} employees (Page {currentPage} of {totalFilteredPages || 1})
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {currentUsers.map(user => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={user.image}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Age: {user.age}
                </p>
              </div>
              <button
                onClick={() => toggleBookmark(user)}
                className={`p-1.5 rounded-full transition-colors ${
                  bookmarks.has(user.id)
                    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
                title={bookmarks.has(user.id) ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark className={`w-5 h-5 ${bookmarks.has(user.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                📧 {user.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                🏢 {user.company?.department || 'No Department'}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Performance Rating
              </p>
              {renderStars(user.rating)}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleView(user.id)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4" />
                <span>View</span>
              </button>
              <button
                onClick={() => handlePromote(user)}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Promote</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {renderPagination()}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No employees found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters
          </p>
        </div>
      )}

      {promotedUser && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50">
          <p className="font-medium">
            🎉 {promotedUser.firstName} {promotedUser.lastName} has been promoted!
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;